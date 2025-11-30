export const fallbackLng = 'en'
export const languages = [fallbackLng, 'hi', 'mr', 'ml']
export const cookieName = 'i18next'

export function getOptions(lng = fallbackLng, ns = 'translation') {
    return {
        // debug: true,
        supportedLngs: languages,
        fallbackLng,
        lng,
        fallbackNS: 'translation',
        defaultNS: 'translation',
        ns
    }
}
