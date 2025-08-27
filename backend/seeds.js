// seed.js
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Replace with your MongoDB connection string
const corsOptions = {
  origin: ['http://localhost:3000', 'https://my-time-hazel.vercel.app'],
  credentials: true
};

app.use(express.json());
require("dotenv").config();



mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB!');
})
.catch((err) => {
    console.log('Not connected to MongoDB.', err);
});


// Define the schema for learning resources
const youTubeResourceSchema = new mongoose.Schema({
    channel: String,
    language: String,
    content: String
});

// Define the schema for the required skills object
// We use 'mongoose.Schema.Types.Mixed' to handle the various key-value pairs
// within the 'required_skills' object, as its structure changes.
const requiredSkillsSchema = new mongoose.Schema({
    languages: mongoose.Schema.Types.Mixed,
    frameworks: mongoose.Schema.Types.Mixed,
    databases: mongoose.Schema.Types.Mixed,
    tools: mongoose.Schema.Types.Mixed,
    networking: String,
    operating_systems: String,
    other_skills: String
});

// Define the schema for a single specialization within a field
const specializationSchema = new mongoose.Schema({
    specialization: String,
    tasks: String,
    required_skills: requiredSkillsSchema,
    youtube_resources: [youTubeResourceSchema]
});

// Define the main schema for a computer science field
const computerScienceFieldSchema = new mongoose.Schema({
    field: String,
    description: String,
    specializations: [specializationSchema]
});

// Create the model from the main schema
const ComputerScienceField = mongoose.model('ComputerScienceField', computerScienceFieldSchema);

// The complete JSON data provided by the user
const computerScienceData = {
    "computer_science_fields": [
        {
            "field": "تطوير الويب (Web Development)",
            "description": "هذا المجال يركز على بناء المواقع والتطبيقات التي تعمل عبر المتصفح.",
            "specializations": [
                {
                    "specialization": "الواجهة الأمامية (Front-End Development)",
                    "tasks": "بناء واجهة المستخدم التفاعلية التي يراها الزائر ويتفاعل معها.",
                    "required_skills": {
                        "languages": [
                            "HTML",
                            "CSS",
                            "JavaScript"
                        ],
                        "frameworks": [
                            "React.js",
                            "Angular",
                            "Vue.js"
                        ]
                    },
                    "youtube_resources": [
                        {
                            "channel": "Elzero Web School",
                            "language": "عربي",
                            "content": "الأفضل لتعلم HTML, CSS, JavaScript."
                        },
                        {
                            "channel": "Codezone",
                            "language": "عربي",
                            "content": "ممتاز لتعلم React.js."
                        },
                        {
                            "channel": "Elzero Web School",
                            "language": "عربي",
                            "content": "لتعلم Vue.js."
                        },
                        {
                            "channel": "freeCodeCamp.org",
                            "language": "إنجليزي",
                            "content": "دورات شاملة في جميع المهارات."
                        }
                    ]
                },
                {
                    "specialization": "الواجهة الخلفية (Back-End Development)",
                    "tasks": "بناء منطق الموقع الذي يعمل على الخادم، مثل إدارة قواعد البيانات والمصادقة.",
                    "required_skills": {
                        "languages": [
                            "Python (Django أو Flask)",
                            "Node.js (مع Express)",
                            "PHP (مع Laravel)"
                        ],
                        "databases": [
                            "SQL",
                            "MongoDB"
                        ]
                    },
                    "youtube_resources": [
                        {
                            "channel": "Elzero Web School",
                            "language": "عربي",
                            "content": "لتعلم PHP."
                        },
                        {
                            "channel": "Tarmiz Academy",
                            "language": "عربي",
                            "content": "لتعلم Python "
                        }
                    ]
                }
            ]
        },
        {
            "field": "تطوير تطبيقات الموبايل (Mobile App Development)",
            "description": "هذا المسار يركز على بناء التطبيقات التي تعمل على الهواتف الذكية.",
            "specializations": [
                {
                    "specialization": "تطوير تطبيقات أندرويد (Android Development)",
                    "tasks": "بناء تطبيقات تعمل على نظام أندرويد.",
                    "required_skills": {
                        "languages": [
                            "Kotlin",
                            "Java"
                        ],
                        "tools": [
                            "Android Studio"
                        ]
                    },
                    "youtube_resources": [
                        {
                            "channel": "حسونه اكاديمي",
                            "language": "عربي",
                            "content": "دورات كاملة في تطوير تطبيقات أندرويد."
                        },
                        {
                            "channel": "freeCodeCamp.org",
                            "language": "إنجليزي",
                            "content": "دورات شاملة في Kotlin."
                        }
                    ]
                },
                {
                    "specialization": "تطوير التطبيقات متعددة المنصات (Cross-Platform Development)",
                    "tasks": "بناء تطبيق واحد يعمل على نظامي أندرويد و iOS في نفس الوقت.",
                    "required_skills": {
                        "frameworks": [
                            "Flutter",
                            "React Native"
                        ],
                        "languages": [
                            "Dart",
                            "JavaScript"
                        ]
                    },
                    "youtube_resources": [
                        {
                            "channel": "وائل أبو حمزة",
                            "language": "عربي",
                            "content": "دورة كاملة في Flutter."
                        },
                        {
                            "channel": "Academind",
                            "language": "إنجليزي",
                            "content": "شروحات ممتازة لـ React Native."
                        }
                    ]
                }
            ]
        },
        {
            "field": "علوم البيانات والذكاء الاصطناعي (Data Science & AI)",
            "description": "هذا المجال يركز على تحليل البيانات الضخمة وبناء نماذج الذكاء الاصطناعي.",
            "specializations": [
                {
                    "specialization": "عالم بيانات (Data Scientist)",
                    "tasks": "تحليل البيانات واستخلاص رؤى مفيدة منها لاتخاذ قرارات العمل.",
                    "required_skills": {
                        "languages": [
                            "Python (Pandas, NumPy)"
                        ],
                        "databases": [
                            "SQL"
                        ],
                        "other_skills": "التحليل الإحصائي"
                    },
                    "youtube_resources": [
                        {
                            "channel": "Dataquest",
                            "language": "إنجليزي",
                            "content": "قناة متخصصة في علوم البيانات."
                        },
                        {
                            "channel": "Simplilearn",
                            "language": "إنجليزي",
                            "content": "شروحات للذكاء الاصطناعي والتعلم الآلي."
                        }
                    ]
                },
                {
                    "specialization": "مهندس تعلم آلي (Machine Learning Engineer)",
                    "tasks": "بناء وتطوير نماذج التعلم الآلي والذكاء الاصطناعي ونشرها.",
                    "required_skills": {
                        "languages": [
                            "Python (TensorFlow أو PyTorch)"
                        ],
                        "other_skills": "الرياضيات (الجبر الخطي، التفاضل، والإحصاء)"
                    },
                    "youtube_resources": [
                        {
                            "channel": "3Blue1Brown",
                            "language": "إنجليزي",
                            "content": "لشرح المفاهيم الرياضية المعقدة."
                        },
                        {
                            "channel": "Andrew Ng's Courses",
                            "language": "إنجليزي",
                            "content": "أفضل دورات مجانية في التعلم الآلي."
                        }
                    ]
                }
            ]
        },
        {
            "field": "الأمن السيبراني (Cybersecurity)",
            "description": "هذا المسار يركز على حماية الأنظمة والشبكات والبيانات من الهجمات الإلكترونية.",
            "specializations": [
                {
                    "specialization": "محلل أمني (Security Analyst)",
                    "tasks": "مراقبة الشبكات والأنظمة بحثًا عن التهديدات الأمنية والاستجابة لها.",
                    "required_skills": {
                        "networking": "أساسيات الشبكات (TCP/IP)",
                        "operating_systems": "Linux",
                        "tools": [
                            "Wireshark",
                            "Nmap"
                        ]
                    },
                    "youtube_resources": [
                        {
                            "channel": "Hackers Academy",
                            "language": "عربي",
                            "content": "قناة متخصصة في الأمن السيبراني."
                        },
                        {
                            "channel": "NetworkChuck",
                            "language": "إنجليزي",
                            "content": "يركز على أمن الشبكات."
                        }
                    ]
                },
                {
                    "specialization": "مختبر اختراق (Penetration Tester)",
                    "tasks": "اختبار الأنظمة والشبكات بشكل قانوني لاكتشاف الثغرات الأمنية.",
                    "required_skills": {
                        "languages": [
                            "Python",
                            "Bash"
                        ],
                        "operating_systems": "Kali Linux"
                    },
                    "youtube_resources": [
                        {
                            "channel": "HackerSploit",
                            "language": "إنجليزي",
                            "content": "يقدم دروسًا في اختبار الاختراق."
                        }
                    ]
                }
            ]
        }
    ]
}

// Function to seed the database with the JSON data
const seedDB = async () => {
    try {
        // Clear the collection first to prevent duplicate entries
        await ComputerScienceField.deleteMany({});
        console.log('Previous data cleared.');

        // Insert the data from the JSON object
        for (const field of computerScienceData.computer_science_fields) {
            await ComputerScienceField.create(field);
        }

        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Error seeding the database:', err);
    } finally {
        // Close the connection
        mongoose.disconnect();
        console.log('MongoDB connection closed.');
    }
};

// Run the seeding function
seedDB();
