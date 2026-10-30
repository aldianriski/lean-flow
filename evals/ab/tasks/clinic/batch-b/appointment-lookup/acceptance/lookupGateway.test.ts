import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAppointmentGateway } from './useAppointmentGateway'

afterEach(() => vi.unstubAllGlobals())

describe('useAppointmentGateway lookup', () => {
  it('GETs the appointment and exposes it as data', async () => {
    const appointment = { id: 7, doctorId: 1, patientId: 2, slotStart: '2030-01-02T03:00:00Z' }
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ appointment }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const g = useAppointmentGateway()
    await g.lookup(7)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('/api/appointments/7')
    expect(init.method).toBe('GET')
    expect(g.fault.value).toBeNull()
    expect(g.data.value?.doctorId).toBe(1)
  })

  it('puts the fault in fault, never throws, for an unknown appointment', async () => {
    const body = { fault: { code: 'UNKNOWN_APPOINTMENT', detail: 'lookup refused' } }
    vi.stubGlobal('fetch', async () => new Response(JSON.stringify(body), { status: 404 }))
    const g = useAppointmentGateway()
    await g.lookup(99)
    expect(g.data.value).toBeNull()
    expect(g.fault.value?.code).toBe('UNKNOWN_APPOINTMENT')
  })
})
