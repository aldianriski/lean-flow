# Clinic appointment booking: business notes

## Business goal
A clinic books appointments for patients with doctors. Staff pick a doctor, a patient and a slot start; the system either confirms the appointment or refuses it with a coded fault the UI can show. Staff can also cancel an appointment within the clinic's cancellation policy.

## Main flows
- Book: staff enter doctor ID, patient ID and slot start in the web page; the API checks, in order: unknown doctor, unknown patient, patient record complete, working hours, daily cap, slot free; then saves. Success is 201 with the appointment. Any refusal returns a coded fault.
- Cancel: staff enter the appointment ID; the API looks up the appointment (unknown is 404), checks the cancellation window, then deletes it. Success is 204 with no body.

## Invariants
1. No double booking: a doctor cannot have two appointments with the same slot start. Enforced by a rule and by a database unique constraint on (doctor, slot start).
2. Per-doctor working hours: a slot start is bookable in [work_start, work_end). The start is bookable, the end is not.
3. Patient record required: a patient needs both a date of birth and a phone before booking.
4. Daily cap per doctor: a doctor has at most `daily_cap` appointments per clinic-local calendar day (default 8, must be greater than 0). Bookings of one doctor are serialised so concurrent bookings cannot exceed it.
5. Cancellation window: an appointment can be cancelled only when its slot starts at least 24 hours from now; exactly 24 hours away is still allowed.

## Quality attributes
- Fault codes are a stable API.
- Double booking is impossible even under a race (the database constraint backs the rule); the daily cap also holds under concurrent bookings.
- Rules are pure and unit-testable (explicit `now`, no I/O).
- Tests run against the real database and the real API; Go tests fail rather than skip when the database is unreachable.
- Every refusal, including unknown routes and wrong methods, returns the same envelope so a client handles one error shape.

## Non-goals
- No authentication or authorization.
- No rescheduling (cancel and book again instead).
- No payments or billing.
- No notifications (email, SMS).
- No multi-clinic and no per-doctor time zones.

## Business rules and facts the code does not show
- The clinic runs in one fixed time zone, Asia/Jakarta (UTC+7, no daylight saving). Working hours and the "day" of the daily cap are clinic-local wall-clock times, wherever the browser or server runs.
- The cancellation window is 24 hours by clinic policy: inside 24 hours before the slot the clinic wants the slot honoured, so staff cannot cancel it. A refused cancellation keeps the appointment.
- The daily cap is per doctor (not per clinic or per patient), defaults to 8, and can be changed per doctor in the database.
- A patient record is complete only when both date of birth and phone are present; either one alone does not allow booking.
- A cancelled appointment is deleted, not kept as history. Its slot and its daily-cap place become bookable again immediately.
- Slot uniqueness is per doctor: two different doctors can have the same slot start.
- Who may do what: no authentication; staff book and cancel.
- Fault codes and statuses: SLOT_TAKEN 409, DAILY_CAP_REACHED 409, OUTSIDE_WORKING_HOURS 422, PATIENT_RECORD_INCOMPLETE 422, CANCELLATION_WINDOW_CLOSED 422, INVALID_REQUEST 400, UNKNOWN_DOCTOR 404, UNKNOWN_PATIENT 404, UNKNOWN_APPOINTMENT 404, NOT_FOUND 404 (unknown route), METHOD_NOT_ALLOWED 405 (known route, wrong method), INTERNAL 500.
