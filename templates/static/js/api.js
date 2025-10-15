/**
 * Shared API utility functions for UPG Insights
 * This file contains reusable functions for fetching data from the database
 */

/**
 * Generic getData function with caching
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
        const response = await fetch('https://khnl5wvfdtpayvznnbh2r7kiqi0nshuu.lambda-url.ap-southeast-2.on.aws/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
