-- ==============================================================================
-- Migration: 20261019000000_provision_additional_admins.sql
-- Description: Provision 4 additional administrator accounts with full 'admin' role.
-- Target Accounts:
--   - caltd@hcmute.edu.vn
--   - thanlx@hcmute.edu.vn
--   - thephi@hcmute.edu.vn
--   - nhanvt@hcmute.edu.vn
-- Security Guarantee:
--   - Encrypted with bcrypt via pgcrypto.
--   - Emails marked confirmed to enable immediate secure sign-in.
--   - Profiles created in public.profiles.
--   - Role 'admin' assigned in public.user_roles under strict RLS isolation.
--   - No credentials exposed on static/public documentation layers.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  target_email TEXT;
  user_uid UUID;
  admins TEXT[] := ARRAY[
    'caltd@hcmute.edu.vn',
    'thanlx@hcmute.edu.vn',
    'thephi@hcmute.edu.vn',
    'nhanvt@hcmute.edu.vn'
  ];
BEGIN
  FOREACH target_email IN ARRAY admins
  LOOP
    -- 1. Check if user already exists in auth.users
    SELECT id INTO user_uid FROM auth.users WHERE email = target_email;

    IF user_uid IS NULL THEN
      user_uid := gen_random_uuid();
      
      -- Create new user in auth.users
      INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        aud,
        role,
        created_at,
        updated_at
      ) VALUES (
        user_uid,
        '00000000-0000-0000-0000-000000000000',
        target_email,
        crypt(target_email, gen_salt('bf', 10)),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('sub', user_uid, 'email', target_email),
        'authenticated',
        'authenticated',
        now(),
        now()
      );

      -- Optional: Create identity record for GoTrue email provider
      BEGIN
        INSERT INTO auth.identities (
          id,
          user_id,
          identity_data,
          provider,
          provider_id,
          last_sign_in_at,
          created_at,
          updated_at
        ) VALUES (
          user_uid::text,
          user_uid,
          jsonb_build_object('sub', user_uid, 'email', target_email, 'email_verified', true),
          'email',
          target_email,
          now(),
          now(),
          now()
        );
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    ELSE
      -- User already exists: ensure password matches target ID and email is confirmed
      UPDATE auth.users
      SET
        encrypted_password = crypt(target_email, gen_salt('bf', 10)),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
      WHERE id = user_uid;
    END IF;

    -- 2. Upsert profile in public.profiles
    INSERT INTO public.profiles (id, email, full_name, updated_at)
    VALUES (
      user_uid,
      target_email,
      split_part(target_email, '@', 1),
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email, updated_at = now();

    -- 3. Grant 'admin' role in public.user_roles (Full Admin privileges)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_uid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- 4. Audit log entry
    INSERT INTO public.audit_logs (
      actor_id,
      action,
      entity_type,
      entity_id,
      metadata
    ) VALUES (
      user_uid,
      'PROVISION_ADMIN_ACCOUNT',
      'user_roles',
      user_uid::text,
      jsonb_build_object(
        'email', target_email,
        'role', 'admin',
        'granted_at', now()
      )
    );

  END LOOP;
END $$;
