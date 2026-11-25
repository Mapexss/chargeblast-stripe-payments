CREATE TABLE `balances` (
	`currency` text PRIMARY KEY NOT NULL,
	`available_minor` integer DEFAULT 0 NOT NULL,
	`pending_minor` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `customers_email_idx` ON `customers` (`email`);--> statement-breakpoint
CREATE TABLE `export_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`file_path` text,
	`created_at` integer NOT NULL,
	`filters_json` text NOT NULL,
	`scope` text NOT NULL,
	`error_message` text
);
--> statement-breakpoint
CREATE TABLE `payment_events` (
	`id` text PRIMARY KEY NOT NULL,
	`payment_id` text NOT NULL,
	`type` text NOT NULL,
	`created_at` integer NOT NULL,
	`message` text NOT NULL,
	FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`amount_minor` integer NOT NULL,
	`currency` text NOT NULL,
	`status` text NOT NULL,
	`refunded_amount_minor` integer,
	`failure_code` text,
	`failure_message` text,
	`description` text NOT NULL,
	`created_at` integer NOT NULL,
	`customer_id` text NOT NULL,
	`payment_method_type` text NOT NULL,
	`brand` text,
	`last4` text,
	`funding` text,
	`exp_month` integer,
	`exp_year` integer,
	`cvc_check` text,
	`wallet` text,
	`fee_minor` integer NOT NULL,
	`net_minor` integer NOT NULL,
	`risk_score` integer,
	`decline_code` text,
	`card_fingerprint` text,
	`balance_transaction_id` text,
	`payment_intent_id` text,
	`receipt_email` text,
	`metadata` text DEFAULT '{}' NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `payments_created_at_idx` ON `payments` (`created_at`);--> statement-breakpoint
CREATE INDEX `payments_status_idx` ON `payments` (`status`);--> statement-breakpoint
CREATE INDEX `payments_payment_method_type_idx` ON `payments` (`payment_method_type`);--> statement-breakpoint
CREATE INDEX `payments_amount_minor_idx` ON `payments` (`amount_minor`);--> statement-breakpoint
CREATE INDEX `payments_customer_id_idx` ON `payments` (`customer_id`);--> statement-breakpoint
CREATE INDEX `payments_last4_idx` ON `payments` (`last4`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`price_minor` integer NOT NULL,
	`currency` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_uidx` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);