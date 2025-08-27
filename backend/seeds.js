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


// Define the schema for YouTube resources
const youtubeResourceSchema = new mongoose.Schema({
    channel: String,
    language: String,
    content: String
});

// Define the schema for required skills and tools
const requiredSkillsSchema = new mongoose.Schema({
    skills: [String],
    tools: [String],
    principles: String,
    software: [String],
    methodologies: [String],
    databases: String,
    programming_knowledge: String,
});

// Define the schema for a single specialization
const specializationSchema = new mongoose.Schema({
    specialization: String,
    tasks: String,
    required_skills: requiredSkillsSchema,
    youtube_resources: [youtubeResourceSchema]
});

// Define the main schema for business administration disciplines
const businessDisciplineSchema = new mongoose.mongoose.Schema({
    discipline: String,
    description: String,
    specializations: [specializationSchema]
});

// Create the model from the main schema
const BusinessDiscipline = mongoose.model('BusinessDiscipline', businessDisciplineSchema);

// The complete JSON data provided by the user
const businessData = {
    "business_administration_fields": [
        {
            "discipline": "المحاسبة (Accounting)",
            "description": "هذا المجال يركز على تسجيل وتحليل وتلخيص المعاملات المالية للشركة.",
            "specializations": [
                {
                    "specialization": "المحاسبة المالية (Financial Accounting)",
                    "tasks": "إعداد التقارير المالية (قائمة الدخل، الميزانية العمومية) التي تُستخدم من قبل الأطراف الخارجية مثل المستثمرين والبنوك.",
                    "required_skills": {
                        "principles": "المبادئ المحاسبية (GAAP / IFRS)",
                        "software": [
                            "QuickBooks",
                            "SAP",
                            "Oracle"
                        ],
                        "tools": [
                            "Microsoft Excel"
                        ]
                    },
                    "youtube_resources": [
                        {
                            "channel": "Farah Qutob",
                            "language": "عربي",
                            "content": "لشرح المبادئ المحاسبية."
                        },
                        {
                            "channel": "Accounting Stuff",
                            "language": "إنجليزي",
                            "content": "لدروس مبسطة في المحاسبة."
                        }
                    ]
                },
                {
                    "specialization": "المحاسبة الإدارية (Managerial Accounting)",
                    "tasks": "توفير معلومات مالية للإدارة الداخلية لمساعدتها في اتخاذ القرارات اليومية والاستراتيجية.",
                    "required_skills": {
                        "skills": [
                            "تحليل التكاليف (فهم تكاليف الإنتاج)",
                            "تحليل الميزانية (إعداد الميزانية ومراقبتها)"
                        ]
                    },
                    "youtube_resources": [
                        {
                            "channel": "Edspira",
                            "language": "إنجليزي",
                            "content": "لشرح مفاهيم المحاسبة الإدارية."
                        }
                    ]
                }
            ]
        },
        {
            "discipline": "التسويق (Marketing)",
            "description": "هذا المجال يهدف إلى الترويج للمنتجات وزيادة الوعي بالعلامة التجارية.",
            "specializations": [
                {
                    "specialization": "التسويق الرقمي (Digital Marketing)",
                    "tasks": "استخدام القنوات الرقمية (محركات البحث، وسائل التواصل الاجتماعي) للوصول إلى الجمهور.",
                    "required_skills": {
                        "skills": [
                            "تحسين محركات البحث (SEO)",
                            "إعلانات الدفع لكل نقرة (PPC)",
                            "تحليل البيانات"
                        ],
                        "tools": [
                            "SEMrush",
                            "Google Ads",
                            "Meta Ads",
                            "Google Analytics"
                        ]
                    },
                    "youtube_resources": [
                        {
                            "channel": "Ramy El-Dahan",
                            "language": "عربي",
                            "content": "متخصص في التسويق الرقمي."
                        },
                        {
                            "channel": "Neil Patel",
                            "language": "إنجليزي",
                            "content": "يقدم نصائح في كل جوانب التسويق الرقمي."
                        }
                    ]
                },
                {
                    "specialization": "تسويق المحتوى (Content Marketing)",
                    "tasks": "إنشاء محتوى جذاب (مقالات، فيديوهات، صور) لجذب العملاء.",
                    "required_skills": {
                        "skills": [
                            "كتابة المحتوى",
                            "تصميم الجرافيك",
                            "تحرير الفيديو"
                        ],
                        "tools": [
                            "Canva",
                            "Adobe Photoshop",
                            "Adobe Premiere Pro"
                        ]
                    },
                    "youtube_resources": [
                        {
                            "channel": "محـمـد خـيـال Mohamed Khayal ",
                            "language": "عربي",
                            "content": "لتعلم تصميم الجرافيك."
                        },
                        {
                            "channel": "مصطفى مكرم",
                            "language": "عربي",
                            "content": "لتعلم تصميم الجرافيك."
                        },
                        {
                            "channel": "Cinecom.net",
                            "language": "إنجليزي",
                            "content": "لتعلم تحرير الفيديو."
                        }
                    ]
                }
            ]
        },
        {
            "discipline": "الموارد البشرية (Human Resources)",
            "description": "هذا المجال يركز على إدارة الموظفين في الشركة.",
            "specializations": [
                {
                    "specialization": "التوظيف والاحتفاظ بالمواهب (Talent Acquisition)",
                    "tasks": "جذب أفضل المرشحين وإجراء المقابلات واختيار الموظفين الجدد.",
                    "required_skills": {
                        "skills": [
                            "فهم قوانين التوظيف",
                            "مهارات المقابلات"
                        ]
                    },
                    "youtube_resources": [
                        {
                            "channel": "HRCI Certification",
                            "language": "إنجليزي",
                            "content": "قناة رسمية لشهادات الموارد البشرية."
                        },
                        {
                            "channel": "The Muse",
                            "language": "إنجليزي",
                            "content": "لتقديم نصائح في التوظيف."
                        }
                    ]
                },
                {
                    "specialization": "إدارة الأداء والتطوير (Performance Management)",
                    "tasks": "تقييم أداء الموظفين وتقديم التدريب والدعم لتطوير مهاراتهم.",
                    "required_skills": {
                        "skills": [
                            "إدارة الأداء (وضع أهداف وتقييمها)",
                            "مهارات القيادة (تحفيز وتوجيه الفريق)"
                        ]
                    },
                    "youtube_resources": [
                        {
                            "channel": "Harvard Business Review",
                            "language": "إنجليزي",
                            "content": "لمفاهيم القيادة وإدارة الفرق."
                        }
                    ]
                }
            ]
        },
        {
            "discipline": "نظم المعلومات الإدارية (MIS)",
            "description": "هذا المجال يجمع بين الإدارة وتكنولوجيا المعلومات، ويركز على استخدام البيانات لتحسين قرارات العمل.",
            "specializations": [
                {
                    "specialization": "تحليل النظم (Systems Analysis)",
                    "tasks": "دراسة العمليات التجارية وتحليل البيانات لتحديد الاحتياجات التكنولوجية للمؤسسة.",
                    "required_skills": {
                        "databases": "SQL",
                        "tools": [
                            "Power BI",
                            "Tableau"
                        ],
                        "programming_knowledge": "فهم أساسيات Python."
                    },
                    "youtube_resources": [
                        {
                            "channel": "Simplilearn",
                            "language": "إنجليزي",
                            "content": "لشرح تحليل النظم وأدواته."
                        },
                        {
                            "channel": "Edspira",
                            "language": "إنجليزي",
                            "content": "لمفاهيم إدارة قواعد البيانات."
                        }
                    ]
                },
                {
                    "specialization": "إدارة المشاريع (Project Management)",
                    "tasks": "تخطيط وإدارة مشاريع تكنولوجيا المعلومات لضمان إتمامها في الوقت المحدد وفي حدود الميزانية.",
                    "required_skills": {
                        "methodologies": [
                            "Agile",
                            "Scrum"
                        ],
                        "software": [
                            "Trello",
                            "Asana"
                        ]
                    },
                    "youtube_resources": [
                        {
                            "channel": "Project Management Institute (PMI)",
                            "language": "إنجليزي",
                            "content": "قناة متخصصة في إدارة المشاريع."
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
        await BusinessDiscipline.deleteMany({});
        console.log('Previous data cleared.');

        // Insert the data from the JSON object
        for (const discipline of businessData.business_administration_fields) {
            await BusinessDiscipline.create(discipline);
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
