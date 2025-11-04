/**
 * Shared API utility functions for UPG Insights
 * This file contains reusable functions for fetching data from the database
 */

/**
 * Generic getData function with caching (PostgreSQL Lambda)
 * @param {string} sql - SQL query to execute
 * @param {boolean} cacheBust - Force refresh from API, bypass cache
 * @returns {Promise<any>} - Data from API or cache
 */
async function getData(sql, cacheBust = false) {
    const cacheKey = `cache_${btoa(sql)}`;
    const cacheTimestampKey = `${cacheKey}_timestamp`;

    if (cacheBust) {
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheTimestampKey);
    }

    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
    const now = Date.now();

    if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp, 10) < 3600000) {
        console.log('Fetching from cache: ', cacheKey);
        return JSON.parse(cachedData);
    }

    try {
        console.log('Sending SQL to Lambda (PostgreSQL):', sql);
        const response = await fetch('https://khnl5wvfdtpayvznnbh2r7kiqi0nshuu.lambda-url.ap-southeast-2.on.aws/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Lambda error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const data = await response.json();
        console.log('Fetching data from API:', data);

        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimestampKey, now.toString());

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

/**
 * getData function for SQL Server Lambda with caching
 * @param {string} sql - SQL query to execute
 * @param {boolean} cacheBust - Force refresh from API, bypass cache
 * @returns {Promise<any>} - Data from API or cache
 */
async function getDataSQLServer(sql, cacheBust = false) {
    const cacheKey = `cache_sqlserver_${btoa(sql)}`;
    const cacheTimestampKey = `${cacheKey}_timestamp`;

    if (cacheBust) {
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheTimestampKey);
    }

    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
    const now = Date.now();

    if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp, 10) < 3600000) {
        console.log('Fetching from cache (SQL Server): ', cacheKey);
        return JSON.parse(cachedData);
    }

    try {
        console.log('Sending SQL to Lambda (SQL Server):', sql);
        const response = await fetch('https://tseqda7qkkmjlhkmaierarxge40jnuqi.lambda-url.ap-southeast-2.on.aws/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Lambda error response (SQL Server):', errorText);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const data = await response.json();
        console.log('Fetching data from API (SQL Server):', data);

        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimestampKey, now.toString());

        return data;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}

/**
 * Fetch hypothesis test data for a specific country
 * @param {string} country - Country name to filter by
 * @param {boolean} cacheBust - Force refresh from API
 * @returns {Promise<Array>} - Array of hypothesis test records
 */
async function getHypothesisData(country, cacheBust = false) {
    const sql = `SELECT country, year, trying_to_test, hope_to_learn, learnt FROM upg_historical_hypothesis_tests WHERE country = '${country}' ORDER BY year DESC`;

    console.log('getHypothesisData - SQL Query:', sql);
    console.log('getHypothesisData - Country:', country);

    try {
        const result = await getData(sql, cacheBust);
        console.log('getHypothesisData - Raw result:', result);

        // Handle different response formats
        if (result.rows) {
            console.log('getHypothesisData - Returning result.rows:', result.rows);
            return result.rows;
        } else if (result.data) {
            console.log('getHypothesisData - Returning result.data:', result.data);
            return result.data;
        } else if (Array.isArray(result)) {
            console.log('getHypothesisData - Returning result (array):', result);
            return result;
        }

        console.log('getHypothesisData - Returning empty array');
        return [];
    } catch (error) {
        console.error('Error in getHypothesisData:', error);
        return [];
    }
}

/**
 * Fetch all hypothesis data (no filter)
 * @param {boolean} cacheBust - Force refresh from API
 * @returns {Promise<Array>} - Array of all hypothesis test records
 */
async function getAllHypothesisData(cacheBust = false) {
    const sql = `SELECT country, year, trying_to_test, hope_to_learn, learnt FROM upg_historical_hypothesis_tests ORDER BY year DESC, country`;

    console.log('getAllHypothesisData - SQL Query:', sql);

    try {
        const result = await getData(sql, cacheBust);
        console.log('getAllHypothesisData - Raw result:', result);

        // Handle different response formats
        if (result.rows) {
            console.log('getAllHypothesisData - Returning result.rows:', result.rows);
            return result.rows;
        } else if (result.data) {
            console.log('getAllHypothesisData - Returning result.data:', result.data);
            return result.data;
        } else if (Array.isArray(result)) {
            console.log('getAllHypothesisData - Returning result (array):', result);
            return result;
        }

        console.log('getAllHypothesisData - Returning empty array');
        return [];
    } catch (error) {
        console.error('Error in getAllHypothesisData:', error);
        return [];
    }
}

/**
 * Fetch distinct countries for filter dropdowns
 * @param {boolean} cacheBust
 * @returns {Promise<Array<string>>}
 */
async function getDistinctCountries(cacheBust = false) {
    const sql = `SELECT DISTINCT country FROM upg_historical_hypothesis_tests WHERE country IS NOT NULL AND country <> '' ORDER BY country`;
    try {
        const result = await getData(sql, cacheBust);
        if (Array.isArray(result)) {
            return result.map(r => r.country).filter(Boolean);
        }
        if (result && Array.isArray(result.rows)) {
            return result.rows.map(r => r.country).filter(Boolean);
        }
        if (result && Array.isArray(result.data)) {
            return result.data.map(r => r.country).filter(Boolean);
        }
        return [];
    } catch (e) {
        console.error('getDistinctCountries error', e);
        return [];
    }
}

/**
 * Fetch testimonies from upg_testimonies table
 * Columns: id, country, outcome, impacting, date_posted, testimony
 * @param {Object} options - Optional filters and options
 * @param {string} [options.languageCode] - Filter by language code (e.g., 'vie' for Vietnamese)
 * @param {number} [options.limit=100] - Max number of rows to return
 * @param {boolean} [options.cacheBust=false] - Force refresh from API
 * @returns {Promise<Array>} - Array of testimony records
 */
async function getTestimonies(options = {}) {
    const { languageCode, limit = 100, cacheBust = false } = options;

    const whereClause = languageCode ? `WHERE language = '${languageCode.replace(/'/g, "''")}'` : '';
    const sql = `SELECT country, language, upg, outcome, date_posted, testimony FROM upg_testimonies ${whereClause} ORDER BY date_posted DESC NULLS LAST LIMIT ${limit}`.trim();
    try {
        const result = await getData(sql, cacheBust);
        if (result && Array.isArray(result)) return result;
        if (result && Array.isArray(result.rows)) return result.rows;
        if (result && Array.isArray(result.data)) return result.data;
        return [];
    } catch (error) {
        console.error('Error in getTestimonies:', error);
        return [];
    }
}

/**
 * Fetch digital learning ad metrics from vw_upg_digital_learning_ad_metrics4 view
 * Columns: date, campaign_id, adset_id, ad_id, campaign_name, creative_link, creative_page_id,
 *          post_engagement, reach, imps, clicks, spend, messaging_conversation_started_7d,
 *          unique_link_click, video_p95_watched_actions, gender, age, extracted_country_code,
 *          extracted_language_code, theme, sub_theme, gpt_tagged_at
 * @param {Object} options - Optional filters and options
 * @param {string} [options.languageCode] - Filter by language code (e.g., 'vie' for Vietnamese)
 * @param {boolean} [options.cacheBust=false] - Force refresh from API
 * @returns {Promise<Array>} - Array of digital metrics records
 */
async function getDigitalLearningMetrics(options = {}) {
    const { languageCode, cacheBust = false } = options;

    // SQL Server syntax - TOP 250 to balance data accuracy and performance
    const whereClause = languageCode ? `WHERE extracted_language_code = '${languageCode.replace(/'/g, "''")}'` : '';
    const sql = `SELECT TOP 250 * FROM dbo.vw_upg_digital_learning_ad_metrics4 ${whereClause}`.trim();

    console.log('getDigitalLearningMetrics - SQL Query:', sql);
    console.log('getDigitalLearningMetrics - Language Code:', languageCode);

    try {
        const result = await getDataSQLServer(sql, cacheBust);
        console.log('getDigitalLearningMetrics - Raw result:', result);

        if (result && Array.isArray(result)) return result;
        if (result && Array.isArray(result.rows)) return result.rows;
        if (result && Array.isArray(result.data)) return result.data;
        return [];
    } catch (error) {
        console.error('Error in getDigitalLearningMetrics:', error);
        return [];
    }
}

/**
 * Fetch demographics data from upg_demographics table
 * Columns: id, country, language, upg, religion, population_size, introduction,
 *          everyday_lives, demographics, environment, stories_music, linguistics,
 *          appearance, cultural_nuances, beliefs, worldviews, blockers_to_christianity,
 *          felt_specific_needs, technology_adaptation, literacy, security_country_profile,
 *          security_conversion_risk
 * @param {Object} options - Optional filters and options
 * @param {string} [options.languageCode] - Filter by language code (e.g., 'VIE' for Vietnamese)
 * @param {boolean} [options.cacheBust=false] - Force refresh from API
 * @returns {Promise<Object|null>} - Demographics record or null if not found
 */
async function getUpgDemographics(options = {}) {
    const { languageCode, cacheBust = false } = options;

    if (!languageCode) {
        console.warn('getUpgDemographics - No language code provided');
        return null;
    }

    // SQL Server query - select all relevant columns (with dbo schema prefix)
    const sql = `SELECT TOP 1 country, language, upg, religion, population_size, introduction, everyday_lives, demographics, environment, stories_music, linguistics, appearance, cultural_nuances, beliefs, worldviews, blockers_to_christianity, felt_specific_needs, technology_adaptation, literacy, security_country_profile, security_conversion_risk FROM upg_demographics WHERE language = '${languageCode.replace(/'/g, "''")}'`;

    console.log('getUpgDemographics - SQL Query:', sql);
    console.log('getUpgDemographics - Language Code:', languageCode);

    try {
        const result = await getData(sql, cacheBust);
        console.log('getUpgDemographics - Raw result:', result);

        let data = null;
        if (result && Array.isArray(result) && result.length > 0) {
            data = result[0];
        } else if (result && Array.isArray(result.rows) && result.rows.length > 0) {
            data = result.rows[0];
        } else if (result && Array.isArray(result.data) && result.data.length > 0) {
            data = result.data[0];
        }

        return data;
    } catch (error) {
        console.error('Error in getUpgDemographics:', error);
        return null;
    }
}