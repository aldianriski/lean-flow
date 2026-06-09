# Testability — what to mock, how to design, what to refactor

Companion to `/tdd`. Read when a test is hard to write or you're unsure what to mock — that
difficulty is usually a design signal, not a testing problem.

## What to mock (and what not to)

Mock at **system boundaries only**:
- External APIs (payment, email, third-party services)
- Databases — *sometimes*; prefer a real test DB
- Time and randomness
- The file system — *sometimes*

**Don't mock** your own classes, internal collaborators, or anything you control. Mocking internal
parts couples the test to implementation — the moment you refactor, the test breaks though behaviour
didn't change. If you feel the urge to mock your own code, the interface is probably too coupled;
fix the design instead.

## Design for testability

A test that's painful to write is telling you to change the code, not the test.

1. **Accept dependencies, don't create them** — pass externals in (dependency injection):
   ```
   GOOD:  processPayment(order, paymentClient)
   HARD:  processPayment(order)            // new StripeClient(...) created inside — unmockable
   ```
2. **Return results, don't mutate** — a function that returns a value is trivially testable; one that
   produces a hidden side effect is not.
   ```
   GOOD:  calculateDiscount(cart): Discount
   HARD:  applyDiscount(cart): void        // mutates cart.total in place
   ```
3. **Prefer SDK-style interfaces over one generic fetcher** — a named function per operation
   (`getUser(id)`, `createOrder(data)`) mocks to one fixed shape; a single `fetch(endpoint, opts)`
   forces conditional logic inside every mock.
4. **Small surface area** — fewer methods = fewer tests; fewer params = simpler setup. Aim for a
   *deep module*: a small interface hiding substantial implementation, not a thin pass-through.

## Good vs bad test (the shape to copy)

```
GOOD — verifies behaviour through the public interface:
  test("createUser makes the user retrievable") {
    const user = await createUser({ name: "Alice" })
    expect((await getUser(user.id)).name).toBe("Alice")
  }

BAD — bypasses the interface / asserts on internals:
  test("createUser saves to the database") {
    await createUser({ name: "Alice" })
    expect(await db.query("SELECT … WHERE name = 'Alice'")).toBeDefined()   // side channel
  }
  test("checkout calls paymentService.process") {
    expect(mockPayment.process).toHaveBeenCalledWith(cart.total)            // call-count on internal
  }
```
One logical assertion per test. The name describes WHAT capability exists, not HOW it runs.

## Refactor candidates (after GREEN)

| Smell | Move |
|---|---|
| Duplication | extract a function / class |
| Long method | break into private helpers (keep tests on the public interface) |
| Shallow module (thin pass-through) | combine or deepen behind a smaller interface |
| Feature envy | move the logic to where the data lives |
| Primitive obsession | introduce a value object |
| New code exposes old problems | fix what the new code revealed |
