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
const learningResourceSchema = new mongoose.Schema({
    platform: String,
    channel: String,
    description: String
});

// Define the schema for skills and tools.
// We use 'mongoose.Schema.Types.Mixed' for 'core_skills'
// to handle both array and object data structures.
const skillsAndToolsSchema = new mongoose.Schema({
    core_skills: mongoose.Schema.Types.Mixed,
    additional_skills: String,
    additional_tools: String
});

// Define the schema for a single specialization
const specializationSchema = new mongoose.Schema({
    job_title: String,
    responsibilities: String,
    skills_and_tools: skillsAndToolsSchema,
    learning_resources: [learningResourceSchema]
});

// Define the main schema for engineering disciplines
const engineeringDisciplineSchema = new mongoose.Schema({
    discipline: String,
    specializations: [specializationSchema]
});

// Create the model from the main schema
const EngineeringDiscipline = mongoose.model('EngineeringDiscipline', engineeringDisciplineSchema);

// The complete JSON data provided by the user
const engineeringData = {
    "engineering_fields": [
        {
            "discipline": "هندسة الميكاترونكس",
            "specializations": [
                {
                    "job_title": "مهندس أتمتة (Automation Engineer)",
                    "responsibilities": "تصميم وتطوير أنظمة التحكم الصناعية. برمجة أجهزة التحكم المنطقي القابلة للبرمجة (PLC) لضمان عمل الآلات والمصانع بشكل آلي وفعال.",
                    "skills_and_tools": {
                        "core_skills": [
                            "PLC (Siemens TIA Portal, Rockwell Studio 5000)",
                            "HMI (Human-Machine Interface)"
                        ],
                        "additional_skills": "برمجة الروبوتات"
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "Automaton Academy",
                            "description": "قناة عربية متخصصة في شرح PLC خطوة بخطوة."
                        },
                        {
                            "platform": "YouTube",
                            "channel": "RealPars",
                            "description": "قناة أجنبية تقدم دورات تفصيلية في مجال الأتمتة والتحكم الآلي."
                        }
                    ]
                },
                {
                    "job_title": "مهندس روبوتات (Robotics Engineer)",
                    "responsibilities": "يُصمم الروبوتات، ويبرمجها، ويطورها لتنفيذ أهداف محددة بدقة.",
                    "skills_and_tools": {
                        "core_skills": {
                            "برمجة": [
                                "Python",
                                "C++",
                                "MATLAB"
                            ],
                            "منصات": [
                                "Robot Operating System - ROS)"
                            ]
                        },
                        "additional_tools": "أدوات المحاكاة (Gazebo, V-REP)"
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "TheMocra",
                            "description": "قناة عربية تركز على الروبوتات وبرمجة أنظمة التحكم."
                        },
                        {
                            "platform": "YouTube",
                            "channel": "RoboHub",
                            "description": "قناة أجنبية تعرض أحدث الأبحاث والتطورات في مجال الروبوتات."
                        }
                    ]
                },
                {
                    "job_title": "تصميم وتصنيع الاسطمبات (Mold Design and Manufacturing)",
                    "responsibilities": "تصميم وتصنيع القوالب (الاسطمبات) المستخدمة في إنتاج القطع البلاستيكية والمعدنية بالحقن أو الضغط.",
                    "skills_and_tools": {
                        "core_skills": [
                            "CAD (SolidWorks, CATIA)",
                            "CAM (Mastercam)"
                        ],
                        "additional_skills": "فهم علم المواد وعمليات التصنيع"
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "GoEngineer",
                            "description": "دروس متقدمة في SolidWorks."
                        },
                        {
                            "platform": "YouTube",
                            "channel": "Autodesk Manufacturing",
                            "description": "شروحات لاستخدام برامج التصنيع."
                        }
                    ]
                }
            ]
        },
        {
            "discipline": "هندسة الميكانيكا",
            "specializations": [
                {
                    "job_title": "مهندس تصميم ميكانيكي (Mechanical Design Engineer)",
                    "responsibilities": "يصمم المنتجات والآلات باستخدام برامج الحاسوب. يتأكد من أن التصميم يلبي المعايير الهندسية وأن المنتج سيكون آمنًا وعمليًا.",
                    "skills_and_tools": {
                        "core_skills": {
                            "CAD": [
                                "SolidWorks",
                                "CATIA",
                                "AutoCAD",
                                "Inventor"
                            ],
                            "additional_tools": "FEA (Finite Element Analysis) مثل ANSYS وABAQUS"
                        }
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "Hamed Shaker",
                            "description": "قناة عربية ممتازة لتعلم SolidWorks وInventor."
                        },
                        {
                            "platform": "YouTube",
                            "channel": "محاضرات المهندس محمود مرزوق",
                            "description": "قناة عربية ممتازة لتعلم SolidWorks وInventor."
                        },
                        {
                            "platform": "YouTube",
                            "channel": "GoEngineer",
                            "description": "قناة أجنبية تقدم دروسًا متقدمة في SolidWorks."
                        }
                    ]
                },
                {
                    "job_title": "مهندس إنتاج (Production Engineer)",
                    "responsibilities": "يشرف على عمليات التصنيع في المصانع ويحسنها لزيادة الكفاءة والجودة وتقليل التكاليف.",
                    "skills_and_tools": {
                        "core_skills": [
                            "CAM (Fusion 360, Mastercam)",
                            "CNC Machining"
                        ],
                        "additional_skills": "إدارة الجودة"
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "Autodesk Manufacturing",
                            "description": "قناة رسمية لشركة أوتوديسك توضح كيفية استخدام برامجها في التصنيع."
                        },
                        {
                            "platform": "YouTube",
                            "channel": "Titans of CNC",
                            "description": "قناة أجنبية عن التصنيع وماكينات CNC."
                        }
                    ]
                },
                {
                    "job_title": "ميكانيكا القوى (Power Mechanics)",
                    "responsibilities": "تصميم وتحليل أنظمة توليد الطاقة، مثل محطات الطاقة البخارية والغازية، ومحركات الاحتراق الداخلي.",
                    "skills_and_tools": {
                        "core_skills": [
                            "الديناميكا الحرارية",
                            "ميكانيكا الموائع",
                            "محاكاة الأنظمة (MATLAB/Simulink)"
                        ]
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "Learn Engineering",
                            "description": "شروحات لمبادئ الديناميكا الحرارية والمحركات."
                        }
                    ]
                }
            ]
        },
        {
            "discipline": "هندسة طبية",
            "specializations": [
                {
                    "job_title": "مهندس أجهزة طبية (Medical Devices Engineer)",
                    "responsibilities": "يشارك في تصميم وتطوير الأجهزة الطبية مثل أجهزة التصوير بالأشعة السينية أو أجهزة قياس ضغط الدم، ويضمن سلامة هذه الأجهزة وفعاليتها.",
                    "skills_and_tools": {
                        "core_skills": {
                            "برامج تصميم ومحاكاة": [
                                "SolidWorks",
                                "MATLAB",
                                "COMSOL Multiphysics"
                            ]
                        },
                        "additional_skills": "برمجة (C++, Python) لتطوير برامج الأجهزة."
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "Learn Engineering",
                            "description": "قناة أجنبية تشرح المبادئ الهندسية وراء الأجهزة الطبية."
                        },
                        {
                            "platform": "YouTube",
                            "channel": "TED-Ed",
                            "description": "تقدم فيديوهات عن الابتكارات في التكنولوجيا الطبية."
                        }
                    ]
                }
            ]
        },
        {
            "discipline": "الهندسة المعمارية",
            "specializations": [
                {
                    "job_title": "مهندس معماري (Architect)",
                    "responsibilities": "يخطط ويصمم المباني والمنشآت. يركز على الجانب الجمالي والوظيفي للهيكل، مع مراعاة السلامة والبيئة.",
                    "skills_and_tools": {
                        "core_skills": [
                            "BIM (Building Information Modeling) مثل Revit",
                            "CAD (Computer-Aided Design) مثل AutoCAD"
                        ]
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "Architecture & Design",
                            "description": "قناة أجنبية تعرض تصميمات معمارية مبدعة."
                        },
                        {
                            "platform": "YouTube",
                            "channel": "ArchiSketch",
                            "description": "قناة تركز على فن الرسم المعماري باليد والبرامج."
                        }
                    ]
                },
                {
                    "job_title": "مصمم داخلي (Interior Designer)",
                    "responsibilities": "يركز على تصميم المساحات الداخلية للمباني، واختيار الأثاث والإضاءة والألوان لخلق بيئة جذابة ومريحة.",
                    "skills_and_tools": {
                        "core_skills": {
                            "برامج التصميم ثلاثي الأبعاد ": [
                                "3ds Max",
                                "SketchUp"
                            ]
                        },
                        "additional_tools": "برامج الرندر (Rendering) مثل V-Ray"
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "3D Tuts",
                            "description": "قناة أجنبية متخصصة في شرح برنامج 3ds Max."
                        },
                        {
                            "platform": "YouTube",
                            "channel": "SketchUp",
                            "description": "القناة الرسمية للبرنامج، وتقدم شروحات مفصلة."
                        }
                    ]
                }
            ]
        },
        {
            "discipline": "هندسة مدنية",
            "specializations": [
                {
                    "job_title": "مهندس إنشائي (Structural Engineer)",
                    "responsibilities": "يحلل ويصمم الهياكل الإنشائية مثل الجسور والمباني للتأكد من أنها قوية ومستقرة وآمنة.",
                    "skills_and_tools": {
                        "core_skills": {
                            "برامج التحليل الإنشائي": [
                                "SAP2000",
                                "Etabs",
                                "STAAD.Pro"
                            ]
                        },
                        "additional_tools": "برامج التصميم (Revit Structure)"
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "Civil Engineering",
                            "description": "قناة أجنبية تقدم دروسًا في التحليل الإنشائي."
                        },
                        {
                            "platform": "YouTube",
                            "channel": "The B1M",
                            "description": "قناة أجنبية تعرض مشاريع بناء كبرى حول العالم."
                        }
                    ]
                },
                {
                    "job_title": "مهندس طرق (Highway Engineer)",
                    "responsibilities": "يشارك في تخطيط وتصميم الطرق والجسور وشبكات النقل.",
                    "skills_and_tools": {
                        "core_skills": "برامج التصميم (Civil 3D)",
                        "additional_tools": "برامج محاكاة المرور (VISSIM)"
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "Learn Civil 3D",
                            "description": "قناة أجنبية متخصصة في Civil 3D."
                        }
                    ]
                }
            ]
        },
        {
            "discipline": "هندسة كيميائية",
            "specializations": [
                {
                    "job_title": "مهندس عمليات (Process Engineer)",
                    "responsibilities": "يُصمم العمليات الصناعية التي تحول المواد الخام إلى منتجات نهائية بطريقة فعالة واقتصادية وآمنة.",
                    "skills_and_tools": {
                        "core_skills": {
                            "برامج محاكاة العمليات": [
                                "Aspen Plus",
                                "ChemCAD"
                            ]
                        },
                        "additional_tools": "برامج تصميم المصانع (AutoCAD P&ID)"
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "Chemical Engineering with Kevin Gaughan",
                            "description": "قناة أجنبية متخصصة في شرح العمليات الكيميائية."
                        },
                        {
                            "platform": "YouTube",
                            "channel": "Learn Engineering",
                            "description": "تقدم شروحات لمختلف العمليات الهندسية."
                        }
                    ]
                }
            ]
        },
        {
            "discipline": "هندسة كهربائية",
            "specializations": [
                {
                    "job_title": "مهندس إلكترونيات (Electronics Engineer)",
                    "responsibilities": "يصمم الدوائر الإلكترونية والأنظمة المستخدمة في أجهزة الحاسوب، وأنظمة الاتصالات، والأنظمة الطبية.",
                    "skills_and_tools": {
                        "core_skills": {
                            "برامج محاكاة الدوائر": [
                                "Proteus",
                                "Multisim"
                            ]
                        },
                        "additional_tools": "برامج تصميم لوحات الدوائر المطبوعة (PCB) مثل Altium Designer, Eagle, KiCAD, Easy EDA"
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "EEVblog",
                            "description": "قناة أجنبية تقدم مراجعات وشروحات للأجهزة الإلكترونية."
                        },
                        {
                            "platform": "YouTube",
                            "channel": "Walid Issa",
                            "description": "قناة عربية تقدم دورات في الإلكترونيات."
                        }
                    ]
                },
                {
                    "job_title": "مهندس اتصالات (Telecommunications Engineer)",
                    "responsibilities": "يشارك في تصميم شبكات الاتصالات وتطويرها وصيانتها، مثل شبكات الإنترنت والهاتف المحمول.",
                    "skills_and_tools": {
                        "core_skills": {
                            "برامج محاكاة الشبكات": [
                                "Cisco Packet Tracer",
                                "GNS3"
                            ]
                        },
                        "additional_tools": "أجهزة قياس الشبكات (مثل OTDR, Spectrum Analyzer)"
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "The Networking Doctor",
                            "description": "قناة أجنبية متخصصة في شرح شبكات الاتصالات."
                        }
                    ]
                },
                {
                    "job_title": "هندسة القوى الكهربائية (Electrical Power Engineering)",
                    "responsibilities": "تصميم أنظمة توليد ونقل وتوزيع الطاقة الكهربائية.",
                    "skills_and_tools": {
                        "core_skills": {
                            "برامج محاكاة الشبكات الكهربائية": [
                                "ETAP",
                                "PSIM"
                            ]
                        }
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "Electrical4U",
                            "description": "شروحات باللغة الإنجليزية لمفاهيم القوى الكهربائية."
                        }
                    ]
                },
                {
                    "job_title": "هندسة الشبكات الكهربائية (Electrical Grids Engineering)",
                    "responsibilities": "تخطيط وتصميم وإدارة الشبكات الكهربائية وأنظمة التحكم بها.",
                    "skills_and_tools": {
                        "core_skills": [
                            "SCADA systems",
                            "GIS mapping"
                        ]
                    },
                    "learning_resources": [
                        {
                            "platform": "YouTube",
                            "channel": "The B1M",
                            "description": "فيديوهات عن مشاريع البنية التحتية ومنها الشبكات الكهربائية."
                        }
                    ]
                }
            ]
        }
    ]
};

// Function to seed the database with the JSON data
const seedDB = async () => {
    try {
        // Clear the collection first to prevent duplicate entries
        await EngineeringDiscipline.deleteMany({});
        console.log('Previous data cleared.');

        // Insert the data from the JSON object
        for (const discipline of engineeringData.engineering_fields) {
            await EngineeringDiscipline.create(discipline);
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
