/**
 * Quiz Results Data - Multi-Country
 *
 * This file contains survey data from multiple countries:
 *
 * NEPAL - 3 quizzes:
 * 1. Importance to God Quiz
 * 2. Does God Love Me Quiz
 * 3. My Purpose Quiz
 *
 * BANGLADESH (Bangla) - 3 quizzes:
 * 1. Importance to God Quiz - Bangla
 * 2. Does God Love Me Quiz - Bangla
 * 3. My Purpose Quiz - Bangla
 *
 * Data Structure:
 * - country: Country name
 * - region: Geographic region (optional)
 * - language: Primary language (optional)
 * - quizzes: Array of quiz objects containing questions and response data
 */

const NEPAL_QUIZ_RESULTS = {
  country: "Nepal",
  dataCollectionPeriod: "Historical Data",
  totalQuizzes: 3,

  quizzes: [
    {
      quizId: "importance_to_god",
      quizName: "Importance to God Quiz",
      description: "Survey about beliefs regarding God's importance and relationship with individuals",
      totalQuestions: 22,
      questions: [
        {
          id: "Qimp001",
          question: "Do you believe in God?",
          responses: {
            "Written Answer": 1077,
            "Do I matter?": 1,
            "Yes": 692,
            "No": 290,
            "Maybe": 176
          }
        },
        {
          id: "Qimp002",
          question: "Is God important to you?",
          responses: {
            "Written Answer": 954,
            "Yes": 1,
            "No": 236,
            "Maybe": 2,
            "Very": 385,
            "Somewhat": 375
          }
        },
        {
          id: "Qimp003",
          question: "Do you feel loved by God?",
          responses: {
            "Written Answer": 743,
            "Yes": 477,
            "No": 28,
            "Somewhat": 2,
            "Not Sure": 285
          }
        },
        {
          id: "Qimp004",
          question: "Have you ever had a spiritual dream?",
          responses: {
            "Written Answer": 643,
            "Yes": 402,
            "No": 145,
            "Not Sure": 117
          }
        },
        {
          id: "Qimp005",
          question: "How do you think God would show you love?",
          responses: {
            "Written Answer": 561,
            "Not Sure": 1,
            "Guidance": 156,
            "Talking to me": 64,
            "Blessings": 108,
            "Peace": 254
          }
        },
        {
          id: "Qimp006",
          question: "Do you think God gives you guidance?",
          responses: {
            "Written Answer": 611,
            "Yes": 312,
            "No": 241,
            "Not Sure": 105,
            "Talking to me": 2
          }
        },
        {
          id: "Qimp007",
          question: "Do you think God plans good and bad things?",
          responses: {
            "Written Answer": 548,
            "Yes": 337,
            "No": 155,
            "Not Sure": 103
          }
        },
        {
          id: "Qimp008",
          question: "Do you think God allows bad things to happen to you?",
          responses: {
            "Written Answer": 491,
            "Yes": 168,
            "No": 214,
            "Not Sure": 116
          }
        },
        {
          id: "Qimp009",
          question: "Do you feel like something is missing in your life?",
          responses: {
            "Written Answer": 459,
            "Yes": 259,
            "No": 77,
            "Maybe": 87
          }
        },
        {
          id: "Qimp010",
          question: "Do you consider yourself to be committed to your religious teachings?",
          responses: {
            "Written Answer": 426,
            "Yes": 196,
            "No": 112,
            "Maybe": 76
          }
        },
        {
          id: "Qimp011",
          question: "Do you think God is interested in your problems?",
          responses: {
            "Written Answer": 400,
            "Yes": 179,
            "No": 88,
            "Maybe": 93
          }
        },
        {
          id: "Qimp012",
          question: "Where do you think you will go when you die?",
          responses: {
            "Written Answer": 366,
            "Heaven": 109,
            "Hell": 23,
            "Rebirth": 29,
            "I don't know": 175
          }
        },
        {
          id: "Qimp013",
          question: "How often do you pray?",
          responses: {
            "Written Answer": 348,
            "Often": 161,
            "Sometimes": 127,
            "Never": 76
          }
        },
        {
          id: "Qimp014",
          question: "Have you ever had a supernatural experience?",
          responses: {
            "Written Answer": 333,
            "Yes": 181,
            "No": 110,
            "Not Sure": 58
          }
        },
        {
          id: "Qimp015",
          question: "Do you think you were intelligently designed by a creator?",
          responses: {
            "Written Answer": 347,
            "Yes": 130,
            "No": 83,
            "Not Sure": 79
          }
        },
        {
          id: "Qimp016",
          question: "Does your faith help you get through the challenges of life?",
          responses: {
            "Written Answer": 299,
            "Yes": 194,
            "No": 38,
            "I don't know": 85
          }
        },
        {
          id: "Qimp017",
          question: "Do you have any difficulties relating to God?",
          responses: {
            "Written Answer": 275,
            "Yes": 97,
            "No": 83,
            "Maybe": 61
          }
        },
        {
          id: "Qimp018",
          question: "When do you feel closest to God?",
          responses: {
            "Written Answer": 234,
            "Never": 78,
            "Festivals": 45,
            "Ceremonies": 21,
            "All the time": 75
          }
        },
        {
          id: "Qimp019",
          question: "Do miracles exist?",
          responses: {
            "Written Answer": 219,
            "Yes": 115,
            "No": 69,
            "Maybe": 52
          }
        },
        {
          id: "Qimp020",
          question: "How do you describe God?",
          responses: {
            "Written Answer": 204,
            "Critical": 116,
            "Distant": 25,
            "Kind": 9,
            "Forgiving": 63
          }
        },
        {
          id: "Qimp021",
          question: "What faith do you identify with?",
          responses: {
            "Written Answer": 199,
            "Critical": 1,
            "Islam": 8,
            "Hindu": 131,
            "Christian": 68,
            "Buddhist": 10
          }
        },
        {
          id: "Qimp022",
          question: "Have you heard of Jesus, the one who Christians believe in?",
          responses: {
            "Written Answer": 192,
            "Yes": 119,
            "No": 51,
            "Not Sure": 41
          }
        }
      ]
    },
    {
      quizId: "does_god_love_me",
      quizName: "Does God Love Me Quiz",
      description: "Survey about perceptions of God's love and care",
      totalQuestions: 24,
      questions: [
        {
          id: "Qlove1",
          question: "Do you believe in God?",
          responses: {
            "Written Answer": 699,
            "Maybe": 83,
            "Yes": 426,
            "No": 101,
            "Often": 21,
            "Never": 4,
            "Sometimes": 20
          }
        },
        {
          id: "Qlove2",
          question: "Do you think God loves and cares for you?",
          responses: {
            "Written Answer": 154,
            "Yes": 283,
            "No": 114,
            "Not Sure": 158
          }
        },
        {
          id: "Qlove3",
          question: "Do you think God plans things for people?",
          responses: {
            "Written Answer": 133,
            "Maybe": 7,
            "Yes": 249,
            "No": 116,
            "Not Sure": 106
          }
        },
        {
          id: "Qlove4",
          question: "Do you think God has planned good things for you?",
          responses: {
            "Written Answer": 130,
            "Yes": 225,
            "No": 84,
            "Not Sure": 69,
            "Never": 2,
            "All the time": 12,
            "Festivals": 9,
            "Ceremonies": 5
          }
        },
        {
          id: "Qlove5",
          question: "Does God allow bad things to happen to you?",
          responses: {
            "Written Answer": 133,
            "Maybe": 7,
            "Yes": 110,
            "No": 207,
            "Not Sure": 47
          }
        },
        {
          id: "Qlove6",
          question: "Do you think God could ever be your friend?",
          responses: {
            "Written Answer": 131,
            "Maybe": 86,
            "Yes": 169,
            "No": 38,
            "Distant": 2,
            "Critical": 13,
            "Forgiving": 11
          }
        },
        {
          id: "Qlove7",
          question: "Is God important to you?",
          responses: {
            "Written Answer": 132,
            "Yes": 13,
            "No": 41,
            "Very": 172,
            "Somewhat": 64,
            "Not Sure": 3
          }
        },
        {
          id: "Qlove8",
          question: "Have you ever felt close to God?",
          responses: {
            "Written Answer": 131,
            "Yes": 145,
            "No": 55,
            "Not Sure": 42,
            "Heaven": 6,
            "Rebirth": 2,
            "I don't know": 13
          }
        },
        {
          id: "Qlove9",
          question: "Do you consider yourself to be committed to your religious teachings?",
          responses: {
            "Written Answer": 134,
            "Maybe": 50,
            "Yes": 280,
            "No": 75
          }
        },
        {
          id: "Qlove10",
          question: "Do you think God is interested in your problems?",
          responses: {
            "Written Answer": 701,
            "Maybe": 47,
            "Yes": 210,
            "No": 65,
            "Not Sure": 40
          }
        },
        {
          id: "Qlove11",
          question: "How often do you pray?",
          responses: {
            "Written Answer": 699,
            "Yes": 58,
            "No": 32,
            "Not Sure": 27,
            "Often": 92,
            "Never": 39,
            "Sometimes": 79
          }
        },
        {
          id: "Qlove12",
          question: "Have you ever had a supernatural experience?",
          responses: {
            "Written Answer": 237,
            "Yes": 171,
            "No": 83,
            "Not Sure": 53
          }
        },
        {
          id: "Qlove13",
          question: "Have you ever had a spiritual dream?",
          responses: {
            "Written Answer": 219,
            "Yes": 142,
            "No": 101,
            "Not Sure": 40
          }
        },
        {
          id: "Qlove14",
          question: "Has God ever talked to you?",
          responses: {
            "Written Answer": 206,
            "Maybe": 23,
            "Yes": 120,
            "No": 72,
            "Not Sure": 40
          }
        },
        {
          id: "Qlove15",
          question: "How do you think God would show you love?",
          responses: {
            "Written Answer": 184,
            "No": 8,
            "Very": 41,
            "Somewhat": 17,
            "Guidance": 51,
            "Talking to me": 15,
            "Blessings": 21,
            "Peace": 69
          }
        },
        {
          id: "Qlove16",
          question: "Does your faith help you get through the challenges of life?",
          responses: {
            "Written Answer": 179,
            "Yes": 145,
            "No": 34,
            "Not Sure": 36
          }
        },
        {
          id: "Qlove17",
          question: "Do you have any difficulties relating to God?",
          responses: {
            "Written Answer": 169,
            "Maybe": 35,
            "Yes": 111,
            "No": 57
          }
        },
        {
          id: "Qlove18",
          question: "When do you feel closest to God?",
          responses: {
            "Written Answer": 156,
            "Maybe": 14,
            "Yes": 32,
            "No": 7,
            "Never": 21,
            "All the time": 62,
            "Festivals": 31,
            "Ceremonies": 17
          }
        },
        {
          id: "Qlove19",
          question: "Do miracles exist?",
          responses: {
            "Written Answer": 153,
            "Maybe": 32,
            "Yes": 101,
            "No": 36,
            "Not Sure": 7
          }
        },
        {
          id: "Qlove20",
          question: "How do you describe God?",
          responses: {
            "Written Answer": 148,
            "Yes": 27,
            "No": 10,
            "Not Sure": 7,
            "Distant": 13,
            "Critical": 73,
            "Forgiving": 41,
            "Kind": 3
          }
        },
        {
          id: "Qlove21",
          question: "Have you heard of Jesus, the one who Christians believe in?",
          responses: {
            "Written Answer": 141,
            "Yes": 91,
            "No": 46,
            "Not Sure": 27
          }
        },
        {
          id: "Qlove22",
          question: "Where do you think you will go when you die?",
          responses: {
            "Written Answer": 127,
            "Guidance": 11,
            "Talking to me": 2,
            "Blessings": 3,
            "Peace": 20,
            "Heaven": 46,
            "Hell": 11,
            "Rebirth": 8,
            "I don't know": 50
          }
        },
        {
          id: "Qlove23",
          question: "What faith do you identify with?",
          responses: {
            "Written Answer": 1,
            "Buddhist": 11,
            "Hindu": 73,
            "Christian": 50,
            "Islam": 2
          }
        },
        {
          id: "Qlove24",
          question: "Which people group do you identify with?",
          responses: {
            "Written Answer": 137
          }
        }
      ]
    },
    {
      quizId: "my_purpose",
      quizName: "My Purpose Quiz",
      description: "Survey about life purpose, design, and spiritual guidance",
      totalQuestions: 19,
      questions: [
        {
          id: "Qpurpose1",
          question: "Do you believe in God?",
          responses: {
            "Maybe": 99,
            "Yes": 618,
            "No": 206,
            "I don't know": 37
          }
        },
        {
          id: "Qpurpose2",
          question: "Does God give you guidance?",
          responses: {
            "Yes": 315,
            "No": 171,
            "Not Sure": 30,
            "I don't know": 385
          }
        },
        {
          id: "Qpurpose3",
          question: "Does God plan good and bad things?",
          responses: {
            "Maybe": 28,
            "Yes": 335,
            "No": 165,
            "Somewhat": 1,
            "I don't know": 237
          }
        },
        {
          id: "Qpurpose4",
          question: "Is God important to you?",
          responses: {
            "Yes": 35,
            "No": 191,
            "Very": 213,
            "Somewhat": 234
          }
        },
        {
          id: "Qpurpose5",
          question: "Do you think you were intelligently designed by a creator?",
          responses: {
            "Yes": 273,
            "No": 117,
            "I don't know": 222
          }
        },
        {
          id: "Qpurpose6",
          question: "Do you know your purpose in life?",
          responses: {
            "Yes": 211,
            "No": 186,
            "Somewhat": 1,
            "I don't know": 172
          }
        },
        {
          id: "Qpurpose7",
          question: "What is more important to you?",
          responses: {
            "Yes": 39,
            "No": 10,
            "Religion": 227,
            "Family": 137,
            "Friends": 54,
            "Status": 24,
            "I don't know": 11
          }
        },
        {
          id: "Qpurpose8",
          question: "What does success look like for you?",
          responses: {
            "Maybe": 13,
            "Yes": 19,
            "No": 21,
            "To be loved": 92,
            "To be rich": 113,
            "To be whole": 194
          }
        },
        {
          id: "Qpurpose9",
          question: "Has God spoken to you?",
          responses: {
            "Maybe": 29,
            "Yes": 157,
            "No": 44,
            "Often": 104,
            "Never": 143,
            "Sometimes": 105,
            "To be loved": 1
          }
        },
        {
          id: "Qpurpose10",
          question: "Have you ever had a supernatural experience?",
          responses: {
            "Yes": 69,
            "No": 36,
            "Often": 89,
            "Never": 137,
            "Sometimes": 73,
            "I don't know": 108
          }
        },
        {
          id: "Qpurpose11",
          question: "Do you think that if you make a bad choice, God will start ignoring you?",
          responses: {
            "Yes": 243,
            "No": 93,
            "Somewhat": 1,
            "Sometimes": 1,
            "I don't know": 184
          }
        },
        {
          id: "Qpurpose12",
          question: "Do you think you can benefit the world with your skills?",
          responses: {
            "Yes": 105,
            "No": 113,
            "Very": 52,
            "Somewhat": 67,
            "Not Sure": 114
          }
        },
        {
          id: "Qpurpose13",
          question: "Are you using your skills now to benefit the world?",
          responses: {
            "Maybe": 103,
            "Yes": 173,
            "No": 77,
            "I don't know": 65
          }
        },
        {
          id: "Qpurpose14",
          question: "Are you afraid of failure?",
          responses: {
            "Yes": 178,
            "No": 180,
            "Somewhat": 1,
            "I don't know": 37
          }
        },
        {
          id: "Qpurpose15",
          question: "Do you worry you won't find your purpose?",
          responses: {
            "Yes": 171,
            "No": 74,
            "Religion": 57,
            "Family": 36,
            "Friends": 15,
            "Status": 5,
            "I don't know": 18
          }
        },
        {
          id: "Qpurpose16",
          question: "Has God shown anyone you know their purpose?",
          responses: {
            "Yes": 181,
            "No": 36,
            "To be loved": 24,
            "To be rich": 21,
            "To be whole": 61,
            "I don't know": 43
          }
        },
        {
          id: "Qpurpose17",
          question: "Does your faith help you get through the challenges of life?",
          responses: {
            "Yes": 149,
            "No": 36,
            "Often": 23,
            "Never": 44,
            "Sometimes": 32,
            "I don't know": 51
          }
        },
        {
          id: "Qpurpose18",
          question: "Do you have any difficulties relating to God?",
          responses: {
            "Maybe": 43,
            "Yes": 82,
            "No": 93,
            "Often": 21,
            "Never": 40,
            "Sometimes": 25,
            "I don't know": 1
          }
        },
        {
          id: "Qpurpose19",
          question: "What faith do you identify with?",
          responses: {
            "I don't know": 1,
            "Buddhist": 16,
            "Hindu": 158,
            "Christian": 70,
            "Islam": 6
          }
        }
      ]
    }
  ]
};

const BANGLA_QUIZ_RESULTS = {
  country: "Bangladesh",
  region: "Bangladesh",
  language: "Bangla",
  dataCollectionPeriod: "Historical Data",
  totalQuizzes: 3,

  quizzes: [
    {
      quizId: "importance_to_god",
      quizName: "Importance to God Quiz - Bangla",
      description: "Survey about beliefs regarding God's importance and relationship with individuals",
      totalQuestions: 22,
      questions: [
        {
          id: "Qimp001",
          question: "Do you believe in God?",
          responses: {
            "Written Answer": 75,
            "Yes": 32,
            "No": 19,
            "Maybe": 11
          }
        },
        {
          id: "Qimp002",
          question: "Is God important to you?",
          responses: {
            "Written Answer": 67,
            "Yes": 1,
            "No": 6,
            "Very": 23,
            "Somewhat": 20
          }
        },
        {
          id: "Qimp003",
          question: "Do you feel loved by God?",
          responses: {
            "Written Answer": 58,
            "Yes": 27,
            "No": 9,
            "Not Sure": 14
          }
        },
        {
          id: "Qimp004",
          question: "Have you ever had a spiritual dream?",
          responses: {
            "Written Answer": 49,
            "Yes": 15,
            "No": 17,
            "Not Sure": 11
          }
        },
        {
          id: "Qimp005",
          question: "How do you think God would show you love?",
          responses: {
            "Written Answer": 42,
            "Guidance": 15,
            "Talking to me": 8
          }
        },
        {
          id: "Qimp006",
          question: "Do you think God gives you guidance?",
          responses: {
            "Written Answer": 35,
            "Yes": 24,
            "No": 9,
            "Not Sure": 5
          }
        },
        {
          id: "Qimp007",
          question: "Do you think God plans good and bad things?",
          responses: {
            "Written Answer": 28,
            "Yes": 15,
            "No": 6,
            "Not Sure": 2
          }
        },
        {
          id: "Qimp008",
          question: "Do you think God allows bad things to happen to you?",
          responses: {
            "Written Answer": 26,
            "Yes": 4,
            "No": 14,
            "Not Sure": 5
          }
        },
        {
          id: "Qimp009",
          question: "Do you feel like something is missing in your life?",
          responses: {
            "Written Answer": 23,
            "Yes": 8,
            "No": 4,
            "Maybe": 7
          }
        },
        {
          id: "Qimp010",
          question: "Do you consider yourself to be committed to your religious teachings?",
          responses: {
            "Written Answer": 22,
            "Yes": 7,
            "No": 6,
            "Maybe": 4
          }
        },
        {
          id: "Qimp011",
          question: "Do you think God is interested in your problems?",
          responses: {
            "Written Answer": 17,
            "Yes": 9,
            "No": 6,
            "Maybe": 2
          }
        },
        {
          id: "Qimp012",
          question: "Where do you think you will go when you die?",
          responses: {
            "Written Answer": 18,
            "Heaven": 5,
            "Rebirth": 2,
            "I don't know": 5
          }
        },
        {
          id: "Qimp013",
          question: "How often do you pray?",
          responses: {
            "Written Answer": 14,
            "Rebirth": 1,
            "Often": 5,
            "Sometimes": 7,
            "Never": 3
          }
        },
        {
          id: "Qimp014",
          question: "Have you ever had a supernatural experience?",
          responses: {
            "Written Answer": 13,
            "Yes": 3,
            "No": 5,
            "Not Sure": 4
          }
        },
        {
          id: "Qimp015",
          question: "Do you think you were intelligently designed by a creator?",
          responses: {
            "Written Answer": 13,
            "No": 1,
            "Not Sure": 2
          }
        },
        {
          id: "Qimp016",
          question: "Does your faith help you get through the challenges of life?",
          responses: {
            "Written Answer": 10,
            "No": 3,
            "Not Sure": 2
          }
        },
        {
          id: "Qimp017",
          question: "Do you have any difficulties relating to God?",
          responses: {
            "Written Answer": 9,
            "Yes": 5,
            "No": 4,
            "Maybe": 1
          }
        },
        {
          id: "Qimp018",
          question: "When do you feel closest to God?",
          responses: {
            "Written Answer": 6,
            "Never": 5,
            "All the time": 5
          }
        },
        {
          id: "Qimp019",
          question: "Do miracles exist?",
          responses: {
            "Written Answer": 6,
            "Yes": 3,
            "Maybe": 2
          }
        },
        {
          id: "Qimp020",
          question: "How do you describe God?",
          responses: {
            "Written Answer": 5,
            "Critical": 1,
            "Kind": 2,
            "Forgiving": 3
          }
        },
        {
          id: "Qimp021",
          question: "What faith do you identify with?",
          responses: {
            "Written Answer": 6,
            "Islam": 5,
            "Hindu": 1
          }
        },
        {
          id: "Qimp022",
          question: "Have you heard of Jesus, the one who Christians believe in?",
          responses: {
            "Written Answer": 5,
            "Yes": 5,
            "No": 1,
            "Not Sure": 2
          }
        }
      ]
    },
    {
      quizId: "does_god_love_me",
      quizName: "Does God Love Me Quiz - Bangla",
      description: "Survey about perceptions of God's love and care",
      totalQuestions: 24,
      questions: [
        {
          id: "Qlove1",
          question: "Do you believe in God?",
          responses: {
            "Written Answer": -3,
            "Am I Loved?": 4,
            "Maybe": 21,
            "Yes": 73,
            "No": 18
          }
        },
        {
          id: "Qlove2",
          question: "Do you think God loves and cares for you?",
          responses: {
            "Written Answer": 113,
            "Maybe": 2,
            "Yes": 55,
            "No": 22,
            "Not Sure": 6
          }
        },
        {
          id: "Qlove3",
          question: "Do you think God plans things for people?",
          responses: {
            "Written Answer": 21,
            "Yes": 40,
            "No": 8,
            "Not Sure": 19
          }
        },
        {
          id: "Qlove4",
          question: "Do you think God has planned good things for you?",
          responses: {
            "Written Answer": 17,
            "Yes": 42,
            "No": 5,
            "Not Sure": 9
          }
        },
        {
          id: "Qlove5",
          question: "Does God allow bad things to happen to you?",
          responses: {
            "Written Answer": 17,
            "Yes": 6,
            "No": 45,
            "Not Sure": 3
          }
        },
        {
          id: "Qlove6",
          question: "Do you think God could ever be your friend?",
          responses: {
            "Written Answer": 17,
            "Maybe": 22,
            "Yes": 14,
            "No": 6
          }
        },
        {
          id: "Qlove7",
          question: "Is God important to you?",
          responses: {
            "Written Answer": 17,
            "No": 1,
            "Very": 35,
            "Somewhat": 11
          }
        },
        {
          id: "Qlove8",
          question: "Have you ever felt close to God?",
          responses: {
            "Written Answer": 18,
            "Yes": 23,
            "Not Sure": 8
          }
        },
        {
          id: "Qlove9",
          question: "Do you consider yourself to be committed to your religious teachings?",
          responses: {
            "Written Answer": 17,
            "Maybe": 9,
            "Yes": 21,
            "No": 10
          }
        },
        {
          id: "Qlove10",
          question: "Do you think God is interested in your problems?",
          responses: {
            "Written Answer": 17,
            "Maybe": 3,
            "Yes": 21,
            "No": 8
          }
        },
        {
          id: "Qlove11",
          question: "How often do you pray?",
          responses: {
            "Written Answer": 114,
            "Often": 18,
            "Never": 4,
            "Sometimes": 10
          }
        },
        {
          id: "Qlove12",
          question: "Have you ever had a supernatural experience?",
          responses: {
            "Written Answer": 114,
            "Yes": 12,
            "No": 8,
            "Not Sure": 6
          }
        },
        {
          id: "Qlove13",
          question: "Have you ever had a spiritual dream?",
          responses: {
            "Written Answer": 30,
            "Yes": 7,
            "No": 7,
            "Not Sure": 9
          }
        },
        {
          id: "Qlove14",
          question: "Has God ever talked to you?",
          responses: {
            "Written Answer": 29,
            "Yes": 7,
            "No": 12,
            "Not Sure": 6
          }
        },
        {
          id: "Qlove15",
          question: "How do you think God would show you love?",
          responses: {
            "Written Answer": 29,
            "Guidance": 12,
            "Talking to me": 1
          }
        },
        {
          id: "Qlove16",
          question: "Does your faith help you get through the challenges of life?",
          responses: {
            "Written Answer": 27,
            "No": 2,
            "Not Sure": 2,
            "Guidance": 1
          }
        },
        {
          id: "Qlove17",
          question: "Do you have any difficulties relating to God?",
          responses: {
            "Written Answer": 25,
            "Maybe": 6,
            "Yes": 7,
            "No": 8
          }
        },
        {
          id: "Qlove18",
          question: "When do you feel closest to God?",
          responses: {
            "Written Answer": 22,
            "Never": 1,
            "All the time": 9,
            "Festivals": 1,
            "Ceremonies": 8
          }
        },
        {
          id: "Qlove19",
          question: "Do miracles exist?",
          responses: {
            "Written Answer": 21,
            "Maybe": 9,
            "Yes": 8,
            "No": 2
          }
        },
        {
          id: "Qlove20",
          question: "How do you describe God?",
          responses: {
            "Written Answer": 20,
            "Distant": 1,
            "Critical": 2,
            "Forgiving": 8,
            "Kind": 8
          }
        },
        {
          id: "Qlove21",
          question: "Have you heard of Jesus, the one who Christians believe in?",
          responses: {
            "Written Answer": 17,
            "Yes": 7,
            "No": 4,
            "Not Sure": 4
          }
        },
        {
          id: "Qlove22",
          question: "Where do you think you will go when you die?",
          responses: {
            "Written Answer": 16,
            "Yes": 1,
            "Heaven": 3,
            "Rebirth": 5,
            "I don't know": 3
          }
        },
        {
          id: "Qlove23",
          question: "What faith do you identify with?",
          responses: {
            "Written Answer": 17,
            "Hindu": 2,
            "Christian": 1,
            "Islam": 10
          }
        },
        {
          id: "Qlove24",
          question: "Which people group do you identify with?",
          responses: {
            "Written Answer": 1,
            "Hindu": 2,
            "Christian": 1,
            "Islam": 10
          }
        }
      ]
    },
    {
      quizId: "my_purpose",
      quizName: "My Purpose Quiz - Bangla",
      description: "Survey about life purpose, design, and spiritual guidance",
      totalQuestions: 19,
      questions: [
        {
          id: "Qpurpose1",
          question: "Do you believe in God?",
          responses: {
            "Yes": 17,
            "No": 3,
            "Not Sure": 4
          }
        },
        {
          id: "Qpurpose2",
          question: "Does God give you guidance?",
          responses: {
            "Yes": 7,
            "No": 9,
            "Not Sure": 4
          }
        },
        {
          id: "Qpurpose3",
          question: "Does God plan good and bad things?",
          responses: {
            "No": 3,
            "Very": 11,
            "Somewhat": 3
          }
        },
        {
          id: "Qpurpose4",
          question: "Is God important to you?",
          responses: {
            "Yes": 10,
            "No": 2,
            "Not Sure": 1
          }
        },
        {
          id: "Qpurpose5",
          question: "Do you think you were intelligently designed by a creator?",
          responses: {
            "Yes": 9,
            "No": 4,
            "Not Sure": 1
          }
        },
        {
          id: "Qpurpose6",
          question: "Do you know your purpose in life?",
          responses: {
            "Religion": 7,
            "Family": 1,
            "Friends": 3
          }
        },
        {
          id: "Qpurpose7",
          question: "What is more important to you?",
          responses: {
            "To be whole": 7
          }
        },
        {
          id: "Qpurpose8",
          question: "What does success look like for you?",
          responses: {
            "Often": 2,
            "Never": 4,
            "Sometimes": 2
          }
        },
        {
          id: "Qpurpose9",
          question: "Has God spoken to you?",
          responses: {
            "Yes": 2,
            "No": 1,
            "Not Sure": 3
          }
        },
        {
          id: "Qpurpose10",
          question: "Have you ever had a supernatural experience?",
          responses: {
            "Yes": 6,
            "No": 2,
            "Not Sure": 1
          }
        },
        {
          id: "Qpurpose11",
          question: "Do you think that if you make a bad choice, God will start ignoring you?",
          responses: {
            "Yes": 6,
            "No": 1,
            "Not Sure": 1
          }
        },
        {
          id: "Qpurpose12",
          question: "Do you think you can benefit the world with your skills?",
          responses: {
            "Maybe": 3,
            "Yes": 5,
            "No": 2
          }
        },
        {
          id: "Qpurpose13",
          question: "Are you using your skills now to benefit the world?",
          responses: {
            "Yes": 4,
            "No": 6
          }
        },
        {
          id: "Qpurpose14",
          question: "Are you afraid of failure?",
          responses: {
            "Yes": 3,
            "No": 2,
            "Not Sure": 1
          }
        },
        {
          id: "Qpurpose15",
          question: "Do you worry you won't find your purpose?",
          responses: {
            "Yes": 1,
            "Not Sure": 6
          }
        },
        {
          id: "Qpurpose16",
          question: "Has God shown anyone you know their purpose?",
          responses: {
            "No": 1
          }
        },
        {
          id: "Qpurpose17",
          question: "Does your faith help you get through the challenges of life?",
          responses: {
            "Yes": 1,
            "No": 4
          }
        },
        {
          id: "Qpurpose18",
          question: "Do you have any difficulties relating to God?",
          responses: {
            "Islam": 5
          }
        },
        {
          id: "Qpurpose19",
          question: "What faith do you identify with?",
          responses: {
            "Islam": 5
          }
        }
      ]
    }
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NEPAL_QUIZ_RESULTS,
    BANGLA_QUIZ_RESULTS
  };
}
