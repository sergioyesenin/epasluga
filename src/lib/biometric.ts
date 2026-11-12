/**
 * Вход по биометрии (демо, WebAuthn-ready).
 *
 * Логика как в банковских приложениях: биометрия — не первый вход, а быстрый повторный
 * на уже знакомом устройстве. Сначала человек входит по SMS или ЭЦП, затем включает
 * «входить по отпечатку / Face ID» — и на этом устройстве появляется ключ доступа (passkey).
 *
 * В настоящем приложении:
 *  - включение: navigator.credentials.create({ publicKey }) с challenge от сервера,
 *    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' };
 *  - вход: navigator.credentials.get({ publicKey }) и проверка подписи на сервере.
 * В демо сервера нет, поэтому сохраняем только отметку «включено на этом устройстве».
 * Биометрия не покидает телефон ни в демо, ни в жизни — сервер видит только подпись.
 */

const KEY = 'epasluga-biometric'

export type BiometricEnrollment = {
  enabledAt: string
}

/** Есть ли на устройстве встроенный сканер (отпечаток, Face ID, Windows Hello). */
export async function isBiometricAvailable(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.isSecureContext || !('PublicKeyCredential' in window)) {
    return false
  }
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch {
    return false
  }
}

export function getEnrollment(): BiometricEnrollment | null {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null') as BiometricEnrollment | null
    return raw && typeof raw.enabledAt === 'string' ? raw : null
  } catch {
    return null
  }
}

export function enrollBiometric(): BiometricEnrollment {
  const enrollment = { enabledAt: new Date().toISOString() }
  localStorage.setItem(KEY, JSON.stringify(enrollment))
  return enrollment
}

export function removeBiometric() {
  localStorage.removeItem(KEY)
}
