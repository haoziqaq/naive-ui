import { computed, watch, toRef, ComputedRef } from 'vue'
import { ConfigProviderInjection } from '../../config-provider/src/internal-interface'
import styleScheme from '../../_deprecated/style-scheme'

export type OnLanguageChange = (
  lang: string | undefined,
  oldLang: string | undefined
) => void

interface UseLegacyProps {
  onLanguageChange?: OnLanguageChange
}

interface UseLegacy {
  legacyTheme: ComputedRef<string | undefined>
  legacyLanguage: ComputedRef<string | undefined>
  legacyThemeEnvironment: ComputedRef<any>
  legacyStyleScheme: ComputedRef<any>
}

export default function useLegacy (
  NConfigProvider: ConfigProviderInjection | null,
  props?: UseLegacyProps
): UseLegacy {
  if (NConfigProvider && props) {
    watch(toRef(NConfigProvider, 'mergedLanguage'), (value, oldValue) => {
      const { onLanguageChange } = props
      if (onLanguageChange) onLanguageChange(value, oldValue)
    })
  }
  return {
    legacyTheme: computed(() => {
      return NConfigProvider?.mergedLegacyTheme || 'light'
    }),
    legacyLanguage: computed(() => {
      return NConfigProvider ? NConfigProvider.mergedLanguage : undefined
    }),
    legacyThemeEnvironment: computed(() => {
      const { mergedThemeEnvironments, mergedLegacyTheme } =
        NConfigProvider || {}
      return mergedThemeEnvironments
        ? mergedThemeEnvironments[mergedLegacyTheme || 'light']
        : null
    }),
    legacyStyleScheme: computed(() => {
      return (styleScheme as any)[NConfigProvider?.mergedLegacyTheme || 'light']
    })
  }
}
