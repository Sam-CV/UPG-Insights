// All website data stored as JavaScript objects
const websiteData = {
    // Navigation and site info
    siteName: "UPG Insights",
    navigation: [
        { name: "Home", url: "index.html", active: window.location.pathname === "/index.html" },
    ],

    // Search filters
    searchFilters: {
        regions: ["South Asia", "Southeast Asia", "Middle East", "East Africa", "West Africa"],
        countries: ["Nepal", "India", "Bangladesh", "Pakistan", "Thailand"],
        languages: ["Dangaura", "Hindi", "Nepali", "Bengali", "Tamil"],
        ethnicities: ["Tharu", "Sherpa", "Tamang", "Gurung", "Magar"],
        religions: ["Hindu", "Buddhist", "Muslim", "Christian", "Animist"]
    },

    // Search results - people groups
    peopleGroups: [
        {
            id: "tharu",
            name: "Tharu",
            population: "1.96M",
            country: "Nepal",
            language: "Dangaura",
            religion: "Hindu",
            maleImage: "https://upg-resources.s3.ap-southeast-2.amazonaws.com/1.png",
            femaleImage: "https://upg-resources.s3.ap-southeast-2.amazonaws.com/2.png"
        },
        {
            id: "sherpa",
            name: "Sherpa",
            population: "0.42M",
            country: "Nepal",
            language: "Sherpa",
            religion: "Buddhist",
            maleImage: "/api/placeholder/150/150",
            femaleImage: "/api/placeholder/150/150"
        },
        {
            id: "tamang",
            name: "Tamang",
            population: "1.3M",
            country: "Nepal",
            language: "Tamang",
            religion: "Buddhist",
            maleImage: "/api/placeholder/150/150",
            femaleImage: "/api/placeholder/150/150"
        }
    ],

    // Section data for Tharu people group
    tharu: {
        name: "Tharu",
        mapImage: "https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=560&height=360&center=lonlat:15,35&zoom=0.15&styleCustomization=background:%23e2e2e2|water-offset:none|water:%23ffffff|water-pattern:none|landcover-glacier:none|boundary-land-level-4:none|boundary-land-level-2:%23c8c8c8|boundary-land-disputed:none|boundary-water:none|water-name-ocean:none|water-name-other:none|place-country-2:none|place-country-1:none|place-continent:none&marker=lonlat:84.124,28.3949;type:circle;color:blue;size:small;icontype:material;iconsize:small&apiKey=eccf4dc1db37462898e8beb9a3377d4f",
        //https://www.alol.pl/dotmap/worldmap/big/dot/big/blue/-33.8481647/150.7918937/ulovj2uj.png
        sections: [
            {
                id: "demographics",
                name: "Demographics",
                content: {
                    introduction: {
                        title: "Introduction / History",
                        text: "The Tharu people are an indigenous ethnic group who has lived in the lowlands of Nepal for centuries. As per CBS 2011, the Tharu population of Nepal was counted at 1,737,470 people. The Tarai region was covered by a thick malaria jungle that kept away outsiders and guaranteed the Tharus freedom."
                    },
                    everydayLives: {
                        title: "Everyday lives",
                        points: [
                            "The Tharu people comprise several groups who speak different dialects and differ in traditional dress, customs, rituals and social organization.",
                            "They consider themselves as stewards of the forest. They have lived in the forests for hundreds of years practicing a short fallow shifting cultivation.",
                            "The Tharus are self-supporting and live from farming and fishing.",
                            "Many households keep buffaloes, goats, chickens and pigs.",
                            "The Tharus keep animals, such as cows, goats, and buffaloes.",
                            "Their houses are built of mud and wood, have thatched roofs, and remain cool even during the hot seasons of the Tarai.",
                            "The Tharu diet is simple and nutritious, consisting mostly of rice, lentils, and vegetables.",
                            "These people are also famous for their homemade alcohol, called \"Chang\" which is made from millet or rice."
                        ]
                    },
                    highlights: {
                        title: "Demographic Highlights",
                        stats: [
                            { label: "Population", value: "1.96 M" },
                            { label: "Main Language", value: "Dangaura" },
                            { label: "Main Religion", value: "Hindu" },
                            { label: "Main Country", value: "Nepal" }
                        ],
                        points: [
                            "The Tharu community is one of the largest ethnic groups in Nepal, with a population of approximately 1.96 million.",
                            "They are recognized as official nationality by the Government of Nepal and as a scheduled tribe in India. According to the 2021 census, total population of the Tharu in Nepal is 1,807,914 (6.2%).",
                            "5.86% of Tharus speak their mother tongue."
                        ]
                    },
                    quickNumbers: {
                        title: "Quick Numbers",
                        stats: [
                            { label: "CPA per example", value: "0.002" },
                            { label: "CPA per Faith Journey (USD)", value: "0.05" }
                        ]
                    },
                    topPerforming: {
                        title: "Top performing",
                        stats: [
                            { label: "Videos CPA (USD)", value: "0.002" },
                            { label: "Video Themes", value: "Love" },
                            { label: "Video Name", value: "Love" }
                        ]
                    }
                }
            },
            {
                id: "digital-learnings",
                name: "Digital Learnings",
                content: {
                    campaignData: {
                        title: "Campaigns data",
                        metrics: [
                            { label: "CPA per ITJ (USD)", value: "0.002" },
                            { label: "Best video", value: "0.05" },
                            { label: "Best theme", value: "0.002" },
                            { label: "CPA per example", value: "0.05" },
                            { label: "CPA per example", value: "0.05" },
                            { label: "CPA per example", value: "0.002" },
                            { label: "CPA per example", value: "0.05" },
                            { label: "CPA per example", value: "0.002" },
                            { label: "CPA per example", value: "0.05" },
                            { label: "CPA per example", value: "0.05" },
                            { label: "CPA per example", value: "0.002" },
                            { label: "CPA per example", value: "0.05" },
                            { label: "CPA per example", value: "0.002" },
                            { label: "CPA per example", value: "0.05" },
                            { label: "CPA per example", value: "0.05" }
                        ]
                    },
                    quizzes: {
                        title: "Quizzes",
                        charts: [
                            { 
                                title: "Do you believe in God?",
                                type: "pie",
                                data: [
                                    { label: "Yes", value: 65, color: "#4285F4" },
                                    { label: "No", value: 20, color: "#34A853" },
                                    { label: "Maybe", value: 15, color: "#FBBC05" }
                                ]
                            },
                            { 
                                title: "How often do you pray?",
                                type: "pie",
                                data: [
                                    { label: "Daily", value: 55, color: "#4285F4" },
                                    { label: "Weekly", value: 25, color: "#EA4335" },
                                    { label: "Never", value: 20, color: "#34A853" }
                                ]
                            },
                            { 
                                title: "Is God important to you?",
                                type: "pie",
                                data: [
                                    { label: "Very", value: 60, color: "#4285F4" },
                                    { label: "Somewhat", value: 25, color: "#FBBC05" },
                                    { label: "Not at all", value: 15, color: "#EA4335" }
                                ]
                            },
                            { 
                                title: "Do you attend religious services?",
                                type: "pie",
                                data: [
                                    { label: "Often", value: 45, color: "#4285F4" },
                                    { label: "Sometimes", value: 35, color: "#34A853" },
                                    { label: "Never", value: 20, color: "#EA4335" }
                                ]
                            },
                            { 
                                title: "Are you spiritually fulfilled?",
                                type: "pie",
                                data: [
                                    { label: "Yes", value: 40, color: "#4285F4" },
                                    { label: "No", value: 30, color: "#EA4335" },
                                    { label: "Unsure", value: 30, color: "#FBBC05" }
                                ]
                            },
                            { 
                                title: "Do you find meaning in religion?",
                                type: "pie",
                                data: [
                                    { label: "Yes", value: 55, color: "#4285F4" },
                                    { label: "No", value: 25, color: "#EA4335" },
                                    { label: "Sometimes", value: 20, color: "#FBBC05" }
                                ]
                            },
                            { 
                                title: "Do you read religious texts?",
                                type: "pie",
                                data: [
                                    { label: "Often", value: 35, color: "#4285F4" },
                                    { label: "Sometimes", value: 45, color: "#34A853" },
                                    { label: "Never", value: 20, color: "#EA4335" }
                                ]
                            },
                            { 
                                title: "Where do you go to worship?",
                                type: "pie",
                                data: [
                                    { label: "Temple", value: 50, color: "#4285F4" },
                                    { label: "Home", value: 30, color: "#34A853" },
                                    { label: "Nowhere", value: 20, color: "#EA4335" }
                                ]
                            },
                            { 
                                title: "What faith do you identify with?",
                                type: "pie",
                                data: [
                                    { label: "Hindu", value: 65, color: "#4285F4" },
                                    { label: "Buddhist", value: 25, color: "#EA4335" },
                                    { label: "Other", value: 10, color: "#FBBC05" }
                                ]
                            },
                            { 
                                title: "Do you believe in an afterlife?",
                                type: "pie",
                                data: [
                                    { label: "Yes", value: 70, color: "#4285F4" },
                                    { label: "No", value: 15, color: "#EA4335" },
                                    { label: "Unsure", value: 15, color: "#FBBC05" }
                                ]
                            },
                            { 
                                title: "How important is tradition?",
                                type: "pie",
                                data: [
                                    { label: "Very", value: 65, color: "#4285F4" },
                                    { label: "Somewhat", value: 25, color: "#FBBC05" },
                                    { label: "Not important", value: 10, color: "#EA4335" }
                                ]
                            },
                            { 
                                title: "Do you involve family in worship?",
                                type: "pie",
                                data: [
                                    { label: "Always", value: 55, color: "#4285F4" },
                                    { label: "Sometimes", value: 30, color: "#FBBC05" },
                                    { label: "Never", value: 15, color: "#EA4335" }
                                ]
                            },
                            { 
                                title: "Do you follow religious leaders?",
                                type: "pie",
                                data: [
                                    { label: "Yes", value: 45, color: "#4285F4" },
                                    { label: "No", value: 30, color: "#EA4335" },
                                    { label: "Occasionally", value: 25, color: "#FBBC05" }
                                ]
                            },
                            { 
                                title: "Are ceremonies important to you?",
                                type: "pie",
                                data: [
                                    { label: "Very", value: 60, color: "#4285F4" },
                                    { label: "Somewhat", value: 30, color: "#FBBC05" },
                                    { label: "Not at all", value: 10, color: "#EA4335" }
                                ]
                            },
                            { 
                                title: "Would you change your religion?",
                                type: "pie",
                                data: [
                                    { label: "No", value: 70, color: "#4285F4" },
                                    { label: "Maybe", value: 20, color: "#FBBC05" },
                                    { label: "Yes", value: 10, color: "#EA4335" }
                                ]
                            },
                            { 
                                title: "How often do you fast?",
                                type: "pie",
                                data: [
                                    { label: "Regularly", value: 45, color: "#4285F4" },
                                    { label: "Occasionally", value: 35, color: "#FBBC05" },
                                    { label: "Never", value: 20, color: "#EA4335" }
                                ]
                            },
                            { 
                                title: "Where will you go when you die?",
                                type: "pie",
                                data: [
                                    { label: "Heaven", value: 55, color: "#4285F4" },
                                    { label: "Don't know", value: 35, color: "#FBBC05" },
                                    { label: "Nowhere", value: 10, color: "#EA4335" }
                                ]
                            },
                            { 
                                title: "Is religion relevant today?",
                                type: "pie",
                                data: [
                                    { label: "Yes", value: 65, color: "#4285F4" },
                                    { label: "No", value: 20, color: "#EA4335" },
                                    { label: "Somewhat", value: 15, color: "#FBBC05" }
                                ]
                            },
                            { 
                                title: "Do you donate to religious causes?",
                                type: "pie",
                                data: [
                                    { label: "Regularly", value: 40, color: "#4285F4" },
                                    { label: "Sometimes", value: 40, color: "#FBBC05" },
                                    { label: "Never", value: 20, color: "#EA4335" }
                                ]
                            },
                            { 
                                title: "Do festivals have religious meaning?",
                                type: "pie",
                                data: [
                                    { label: "Yes", value: 70, color: "#4285F4" },
                                    { label: "Somewhat", value: 20, color: "#FBBC05" },
                                    { label: "No", value: 10, color: "#EA4335" }
                                ]
                            }
                        ]
                    },
                    hypothesisTests: {
                        title: "Hypothesis tests",
                        tests: [
                            {
                                hypothesis: "Do Tharu women react better to animations than live images.",
                                result: "Yes, by 20%",
                                tags: ["Female", "video", "reactions"]
                            },
                            {
                                hypothesis: "Do Tharu women react better to animations than live images.",
                                result: "Yes, by 20%",
                                tags: ["Female", "video", "reactions"]
                            },
                            {
                                hypothesis: "Do Tharu women react better to animations than live images.",
                                result: "Yes, by 20%",
                                tags: ["Female", "video", "reactions"]
                            },
                            {
                                hypothesis: "Do Tharu women react better to animations than live images.",
                                result: "Yes, by 20%",
                                tags: ["Female", "video", "reactions"]
                            },
                            {
                                hypothesis: "Do Tharu women react better to animations than live images.",
                                result: "Yes, by 20%",
                                tags: ["Female", "video", "reactions"]
                            },
                            {
                                hypothesis: "Do Tharu women react better to animations than live images.",
                                result: "Yes, by 20%",
                                tags: ["Female", "video", "reactions"]
                            },
                            {
                                hypothesis: "Do Tharu women react better to animations than live images.",
                                result: "Yes, by 20%",
                                tags: ["Female", "video", "reactions"]
                            },
                            {
                                hypothesis: "Do Tharu women react better to animations than live images.",
                                result: "Yes, by 20%",
                                tags: ["Female", "video", "reactions"]
                            },
                            {
                                hypothesis: "Do Tharu women react better to animations than live images.",
                                result: "Yes, by 20%",
                                tags: ["Female", "video", "reactions"]
                            }
                        ]
                    }
                }
            },
            {
                id: "testimonies",
                name: "Testimonies",
                content: {
                    filters: {
                        genders: ["Male", "Female", "All"]
                    },
                    stories: [
                        {
                            title: "From despair to hope",
                            date: "Nov '24",
                            content: "In the heart of Nepal, a Hindu priest named Jagobang found the darkest moment of his life. His beloved wife lay motionless on her bed, barely breathing, as he sat helplessly by her side. Despite the efforts of fellow priests and their rituals, hope seemed lost. A burial had been pronounced - she would die. Grief-stricken, Jagobang mourned for his wife, a Christian prayer-warrior who had previously shared his faith with Jagobang. Guided by an inexplicable urge, Budi reached out after months of silence. Arriving at Jagobang's home, he found a scene of utter despair. With compassion in his heart, Budi prayed for the dying woman in Jesus' name. Against all odds, Budi convinced the reluctant priest to take his wife to the hospital. In the crowded facility, they found a small space and waited through the long, tense hours of early morning. Then, a miracle unfolded - Jagobang's wife stirred, then sat up, seemingly risen from the brink of death. As her eyes focused on her husband, tears streamed down his face. \"This is a miracle!\" he cried, his voice filled with wonder and gratitude. Budi explained how the husband continued to pray, and how Jesus had the power to heal. This moment marked a profound transformation in Jagobang's life. The Hindu priest gave his heart to the Lord, becoming a passionate advocate for Jesus. His story spread, even making headlines in local newspapers, and he reported on the growing trend of Hindu priests directing the sick to Christians for healing. Jagobang's journey from skepticism to faith serves as a powerful testament to the transformative power of compassion, prayer, and unwavering belief. It reminds us that even in our darkest hours, hope can emerge in the most unexpected ways, changing not just one life, but potentially touching many others.",
                            image: "/api/placeholder/400/250",
                            tags: [
                                "Name of main character: Jagobang",
                                "Age of main character: 50 years old",
                                "Occupation of main character: Hindu priest",
                                "Country of residence: Nepal",
                                "Name of Christian pioneer: Budi",
                                "Condition of Jagobang's wife: Very sick, barely breathing"
                            ]
                        },
                        {
                            title: "Living in sadness",
                            date: "Nov '24",
                            content: "In the heart of Nepal, a Hindu priest named Jagobang found the darkest moment of his life. His beloved wife lay motionless on her bed, barely breathing, as he sat helplessly by her side. Despite the efforts of fellow priests and their rituals, hope seemed lost. A burial had been pronounced - she would die. Grief-stricken, Jagobang mourned for his wife, a Christian prayer-warrior who had previously shared his faith with Jagobang. Guided by an inexplicable urge, Budi reached out after months of silence. Arriving at Jagobang's home, he found a scene of utter despair. With compassion in his heart, Budi prayed for the dying woman in Jesus' name. Against all odds, Budi convinced the reluctant priest to take his wife to the hospital. In the crowded facility, they found a small space and waited through the long, tense hours of early morning. Then, a miracle unfolded - Jagobang's wife stirred, then sat up, seemingly risen from the brink of death. As her eyes focused on her husband, tears streamed down his face.",
                            image: "/api/placeholder/400/250",
                            tags: [
                                "Name of main character: Jagobang",
                                "Age of main character: 50 years old",
                                "Occupation of main character: Hindu priest",
                                "Country of residence: Nepal",
                                "Name of Christian pioneer: Budi"
                            ]
                        }
                    ]
                }
            },
            {
                id: "all",
                name: "All",
                content: {
                    overview: {
                        title: "Overview",
                        text: "The Tharu people are an indigenous ethnic group who has lived in the lowlands of Nepal for centuries. The community is one of the largest ethnic groups in Nepal, with a population of approximately 1.96 million. Their main language is Dangaura, and the majority practice Hinduism."
                    },
                    // This section combines highlights from all other sections
                    combinedHighlights: {
                        demographics: {
                            title: "Demographics",
                            stats: [
                                { label: "Population", value: "1.96 M" },
                                { label: "Main Language", value: "Dangaura" },
                                { label: "Main Religion", value: "Hindu" },
                                { label: "Main Country", value: "Nepal" }
                            ]
                        },
                        digitalLearnings: {
                            title: "Digital Learnings",
                            stats: [
                                { label: "Video Completion Rate", value: "68%" },
                                { label: "Engagement Rate", value: "12.3%" }
                            ]
                        },
                        testimonies: {
                            title: "Testimonies",
                            featured: {
                                title: "From despair to hope",
                                date: "Nov '24",
                                excerpt: "In the heart of Nepal, a Hindu priest named Jagobang found the darkest moment of his life. His beloved wife lay motionless on her bed, barely breathing, as he sat helplessly by her side. Despite the efforts of fellow priests and their rituals, hope seemed lost...",
                                image: "/api/placeholder/400/250"
                            }
                        },
                        quickNumbers: {
                            title: "Quick Numbers",
                            stats: [
                                { label: "CPA per example", value: "0.002" },
                                { label: "CPA per Faith Journey (USD)", value: "0.05" },
                                { label: "Videos CPA (USD)", value: "0.002" },
                                { label: "Video Themes", value: "Love" }
                            ]
                        }
                    }
                }
            }
        ]
    }
};

// Add this to your existing data.js file

// Historical Data
websiteData.historicalData = {
    items: [
        {
            id: 1,
            year: 2023,
            country: 'Nepal',
            tested: 'Digital storytelling via WhatsApp',
            hopedToLearn: 'Engagement levels with different story formats',
            learnt: 'Audio stories received 3x more engagement than text-based stories, and users preferred stories under 5 minutes in length.'
        },
        {
            id: 2,
            year: 2022,
            country: 'India',
            tested: 'Facebook video outreach campaigns',
            hopedToLearn: 'Optimal video length and content type for Tharu communities',
            learnt: 'Videos under 90 seconds with cultural elements had 4x higher completion rates and 2x more shares than longer educational content.'
        },
        {
            id: 3,
            year: 2021,
            country: 'Bangladesh',
            tested: 'SMS Bible verse delivery frequency',
            hopedToLearn: 'Ideal cadence for scripture engagement',
            learnt: 'Daily verses had higher open rates (68%) compared to weekly digests (42%), but three times per week had highest response rate and lowest unsubscribe rate.'
        },
        {
            id: 4,
            year: 2022,
            country: 'Nepal',
            tested: 'Radio program formats for rural areas',
            hopedToLearn: 'Most effective radio content structure for retention',
            learnt: 'Q&A format with local speakers resulted in 62% higher recall of key messages compared to monologue teaching formats.'
        },
        {
            id: 5,
            year: 2020,
            country: 'India',
            tested: 'Mobile app UI design preferences',
            hopedToLearn: 'Most intuitive navigation patterns for rural users',
            learnt: 'Icon-based navigation with audio labels performed 45% better than text-based menus with rural audiences who had limited smartphone experience.'
        }
    ]
};

// Export the data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = websiteData;
}