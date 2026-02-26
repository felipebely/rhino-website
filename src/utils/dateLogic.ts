// src/utils/dateLogic.ts

/**
 * Calculates the batch status based on the Rhino business logic:
 * - Deliveries happen every Wednesday.
 * - Cutoff time is Monday at 11:59 PM.
 * - If you order on Tuesday, it's for the NEXT week's Wednesday.
 * 
 * @param now Optional date parameter (useful for testing), defaults to new Date()
 * @returns Object containing the exact delivery date and if the current week's batch is open.
 */
export function getBatchStatus(now: Date = new Date()) {
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Cutoff is Monday (1) at 11:59:59 PM.
    // Practically, this means if it's Tuesday (2), Wednesday (3), etc., 
    // you missed the cutoff for the *upcoming* Wednesday.
    // However, after Wednesday (e.g., Thursday, Friday), the "upcoming" Wednesday is next week anyway.

    // Let's find the nearest Wednesday looking *forward*.
    const daysUntilNextWednesday = (3 - currentDay + 7) % 7;

    // Determine if the *immediate next* Wednesday is still open for orders.
    // The cutoff is Monday 23:59. So if today is Tuesday (2) or Wednesday (3), the order is closed for *that* Wednesday.
    let isCurrentBatchOpen = true;
    let deliveryOffset = daysUntilNextWednesday;

    // If today is Tuesday, the next Wednesday is tomorrow (1 day away). 
    // But the cutoff was Monday. So we push it to the Wednesday *after* that (+7 days).
    if (currentDay === 2) {
        isCurrentBatchOpen = false;
        deliveryOffset += 7;
    }

    // If today is Wednesday, the next Wednesday technically depends on the time.
    // If we calculate `(3 - 3 + 7) % 7`, it is `0` (today).
    // But the cutoff for today already passed on Monday. 
    // So orders placed on Wednesday are for next week (+7 days).
    if (currentDay === 3) {
        isCurrentBatchOpen = false;
        deliveryOffset += 7;
    }

    // Next delivery date calculation
    const nextWednesday = new Date(now);
    nextWednesday.setDate(now.getDate() + deliveryOffset);

    // Set to midnight for clean date comparison if needed
    nextWednesday.setHours(0, 0, 0, 0);

    // To determine precisely when the user can cancel (Up to Monday 23:59:59 before delivery)
    const cutoffLimit = new Date(nextWednesday);
    cutoffLimit.setDate(nextWednesday.getDate() - 2); // Monday is 2 days before Wednesday
    cutoffLimit.setHours(23, 59, 59, 999);

    return {
        isCurrentBatchOpen,
        nextDeliveryDate: nextWednesday,
        cutoffLimit
    };
}

/**
 * Formats a date to Brazilian Portuguese standard format (DD/MM/YYYY)
 */
export function formatDateBR(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

/**
 * Formats a date to PostgreSQL accepted format (YYYY-MM-DD)
 */
export function formatToSQLDate(date: Date): string {
    return date.toISOString().split('T')[0];
}
