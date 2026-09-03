# Security setup

Apply `schema.sql`, `schema_v2.sql`, and `security_hardening.sql` in that order for
a new project. For an existing project, apply only `security_hardening.sql`.

The hardening migration intentionally invalidates old public order-status URLs.
It removes direct anonymous access to orders, order items, and audit logs.

## Create the first administrator

1. In Supabase Authentication, create an email/password user for the site admin.
2. Copy that user's UUID from Authentication > Users.
3. Run this in the SQL editor, replacing the placeholder:

```sql
INSERT INTO public.admin_users (user_id)
VALUES ('YOUR-AUTH-USER-UUID');
```

Do not add a public sign-up flow. Additional administrators must be deliberately
created in Supabase Authentication and inserted into `admin_users`.

## Deployment order

1. Review and export database/log evidence if exposure is suspected.
2. Apply `security_hardening.sql` in Supabase.
3. Create the administrator membership above.
4. Deploy the matching frontend commit.
5. Confirm that an anonymous browser cannot read `orders`, `order_items`, or
   `order_logs`, and cannot update an order directly.
6. Confirm that order creation, the tokenized tracking link, cancellation, and
   authenticated admin access all work.

The public order RPC should also be protected with rate limiting or CAPTCHA at
the edge before using the ordering system at significant scale.
