export function parseNaturalLanguage(q: string) {
    const query = q.toLowerCase();
    const filters: any = {};

    // 1. Gender Mapping
    if (/\bmales?\b/.test(query)) filters.gender = 'male';
    if (/\bfemales?\b/.test(query)) filters.gender = 'female';

    // 2. Age Group / "Young" Mapping
    if (/\byoung\b/.test(query)) {
        filters.min_age = 16;
        filters.max_age = 24;
    }
    if (/\badults?\b/.test(query)) filters.age_group = 'adult';
    if (/\bteenagers?\b/.test(query)) filters.age_group = 'teenager';

    // 3. Age Logic (above/under)
    const aboveMatch = query.match(/above (\d+)/);
    if (aboveMatch) filters.min_age = parseInt(aboveMatch[1]);

    const underMatch = query.match(/under (\d+)/);
    if (underMatch) filters.max_age = parseInt(underMatch[1]);

    // 4. Country Mapping (Requires a lookup table)
    const countryMap: Record<string, string> = { 'nigeria': 'NG', 'angola': 'AO', 'kenya': 'KE' };
    for (const [name, id] of Object.entries(countryMap)) {
        if (query.includes(name)) {
            filters.country_id = id;
            break;
        }
    }

    // Check if we found ANY filters
    if (Object.keys(filters).length === 0) return null;
    return filters;
}
