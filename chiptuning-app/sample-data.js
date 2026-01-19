module.exports = {
  chiptuning_database: {
    metadata: {
      version: "2.0",
      last_updated: "2026-01-19",
      total_vehicles: 50,
      total_brands: 35,
      description: "Force Yazılım - Comprehensive Chiptuning Database",
      supported_stages: ["stage1", "stage2", "stage3"],
      currency: "TRY"
    },
    vehicles: [
      {
        id: 1,
        brand: "BMW",
        model: "320i",
        year: 2020,
        engine: "2.0 TwinPower Turbo",
        displacement: 1998,
        fuel_type: "Benzin",
        original_specs: {
          hp: 184,
          torque: 300,
          fuel_consumption: 6.8
        },
        tuning_stages: {
          stage1: {
            hp: 220,
            torque: 350,
            price: 8500,
            fuel_improvement: 8,
            estimated_time: "2-3 saat",
            required_mods: []
          },
          stage2: {
            hp: 250,
            torque: 380,
            price: 15000,
            fuel_improvement: 5,
            estimated_time: "4-5 saat",
            required_mods: ["Downpipe", "Intercooler"]
          },
          stage3: {
            hp: 280,
            torque: 420,
            price: 25000,
            fuel_improvement: 2,
            estimated_time: "6-8 saat",
            required_mods: ["Turbo Upgrade", "Injectors", "HPFP"]
          }
        },
        ecu_info: {
          type: "Bosch MG1",
          difficulty: "Medium",
          read_method: "OBD"
        },
        notes: "Popüler model, güvenilir Force yazılım"
      },
      {
        id: 2,
        brand: "Mercedes-Benz",
        model: "C200",
        year: 2021,
        engine: "1.5 Turbo",
        displacement: 1497,
        fuel_type: "Benzin",
        original_specs: {
          hp: 184,
          torque: 280,
          fuel_consumption: 6.2
        },
        tuning_stages: {
          stage1: {
            hp: 215,
            torque: 320,
            price: 9000,
            fuel_improvement: 10,
            estimated_time: "2-3 saat",
            required_mods: []
          },
          stage2: {
            hp: 240,
            torque: 350,
            price: 16000,
            fuel_improvement: 6,
            estimated_time: "4-5 saat",
            required_mods: ["Cold Air Intake", "Exhaust"]
          },
          stage3: {
            hp: 270,
            torque: 390,
            price: 28000,
            fuel_improvement: 3,
            estimated_time: "6-8 saat",
            required_mods: ["Turbo Upgrade", "Intercooler", "Fuel System"]
          }
        },
        ecu_info: {
          type: "Continental",
          difficulty: "Hard",
          read_method: "Bench"
        },
        notes: "Yeni nesil ECU, özel Force protokol gerekli"
      },
      {
        id: 3,
        brand: "Audi",
        model: "A4 2.0 TFSI",
        year: 2019,
        engine: "2.0 TFSI",
        displacement: 1984,
        fuel_type: "Benzin",
        original_specs: {
          hp: 190,
          torque: 320,
          fuel_consumption: 6.5
        },
        tuning_stages: {
          stage1: {
            hp: 230,
            torque: 370,
            price: 8800,
            fuel_improvement: 9,
            estimated_time: "2-3 saat",
            required_mods: []
          },
          stage2: {
            hp: 260,
            torque: 410,
            price: 16500,
            fuel_improvement: 5,
            estimated_time: "4-5 saat",
            required_mods: ["Downpipe", "Intake"]
          },
          stage3: {
            hp: 300,
            torque: 450,
            price: 26000,
            fuel_improvement: 2,
            estimated_time: "6-8 saat",
            required_mods: ["Turbo Upgrade", "Injectors", "Intercooler"]
          }
        },
        ecu_info: {
          type: "Bosch MED17",
          difficulty: "Easy",
          read_method: "OBD"
        },
        notes: "Çok popüler platform, mükemmel Force sonuçlar"
      },
      {
        id: 4,
        brand: "Volkswagen",
        model: "Golf GTI",
        year: 2020,
        engine: "2.0 TSI",
        displacement: 1984,
        fuel_type: "Benzin",
        original_specs: {
          hp: 245,
          torque: 370,
          fuel_consumption: 7.1
        },
        tuning_stages: {
          stage1: {
            hp: 290,
            torque: 420,
            price: 9200,
            fuel_improvement: 8,
            estimated_time: "2-3 saat",
            required_mods: []
          },
          stage2: {
            hp: 330,
            torque: 470,
            price: 17000,
            fuel_improvement: 4,
            estimated_time: "4-5 saat",
            required_mods: ["Downpipe", "Intercooler"]
          },
          stage3: {
            hp: 380,
            torque: 520,
            price: 28500,
            fuel_improvement: 1,
            estimated_time: "6-8 saat",
            required_mods: ["Turbo Upgrade", "Injectors", "Clutch"]
          }
        },
        ecu_info: {
          type: "Bosch MG1",
          difficulty: "Easy",
          read_method: "OBD"
        },
        notes: "En popüler Force tuning platformu"
      },
      {
        id: 5,
        brand: "Ford",
        model: "Focus ST",
        year: 2019,
        engine: "2.3 EcoBoost",
        displacement: 2261,
        fuel_type: "Benzin",
        original_specs: {
          hp: 280,
          torque: 420,
          fuel_consumption: 8.2
        },
        tuning_stages: {
          stage1: {
            hp: 320,
            torque: 480,
            price: 8700,
            fuel_improvement: 7,
            estimated_time: "2-3 saat",
            required_mods: []
          },
          stage2: {
            hp: 360,
            torque: 530,
            price: 16800,
            fuel_improvement: 3,
            estimated_time: "4-5 saat",
            required_mods: ["Downpipe", "Cold Air Intake"]
          },
          stage3: {
            hp: 420,
            torque: 600,
            price: 27000,
            fuel_improvement: 0,
            estimated_time: "6-8 saat",
            required_mods: ["Turbo Upgrade", "Intercooler", "Fuel System"]
          }
        },
        ecu_info: {
          type: "Bosch PCM",
          difficulty: "Medium",
          read_method: "OBD"
        },
        notes: "Güçlü EcoBoost motor, mükemmel Force potansiyel"
      },
      {
        id: 6,
        brand: "Toyota",
        model: "Supra 3.0",
        year: 2021,
        engine: "3.0 Twin Turbo",
        displacement: 2998,
        fuel_type: "Benzin",
        original_specs: {
          hp: 340,
          torque: 500,
          fuel_consumption: 8.5
        },
        tuning_stages: {
          stage1: {
            hp: 400,
            torque: 580,
            price: 12000,
            fuel_improvement: 5,
            estimated_time: "3-4 saat",
            required_mods: []
          },
          stage2: {
            hp: 480,
            torque: 650,
            price: 22000,
            fuel_improvement: 2,
            estimated_time: "5-6 saat",
            required_mods: ["Downpipe", "Intercooler", "Intake"]
          },
          stage3: {
            hp: 600,
            torque: 750,
            price: 45000,
            fuel_improvement: -2,
            estimated_time: "8-10 saat",
            required_mods: ["Turbo Upgrade", "Injectors", "HPFP", "Clutch"]
          }
        },
        ecu_info: {
          type: "Bosch MG1",
          difficulty: "Medium",
          read_method: "OBD"
        },
        notes: "Efsanevi Supra, sınırsız Force potansiyel"
      },
      {
        id: 7,
        brand: "Porsche",
        model: "911 Turbo S",
        year: 2020,
        engine: "3.8 Twin Turbo",
        displacement: 3800,
        fuel_type: "Benzin",
        original_specs: {
          hp: 650,
          torque: 800,
          fuel_consumption: 11.2
        },
        tuning_stages: {
          stage1: {
            hp: 720,
            torque: 880,
            price: 18000,
            fuel_improvement: 3,
            estimated_time: "4-5 saat",
            required_mods: []
          },
          stage2: {
            hp: 800,
            torque: 950,
            price: 35000,
            fuel_improvement: 0,
            estimated_time: "6-8 saat",
            required_mods: ["Exhaust System", "Intercooler"]
          },
          stage3: {
            hp: 900,
            torque: 1050,
            price: 65000,
            fuel_improvement: -3,
            estimated_time: "10-12 saat",
            required_mods: ["Turbo Upgrade", "Fuel System", "Transmission"]
          }
        },
        ecu_info: {
          type: "Bosch Trionic",
          difficulty: "Hard",
          read_method: "Bench"
        },
        notes: "Premium Porsche Force tuning, maksimum performans"
      },
      {
        id: 8,
        brand: "Nissan",
        model: "GT-R R35",
        year: 2019,
        engine: "3.8 Twin Turbo VR38",
        displacement: 3799,
        fuel_type: "Benzin",
        original_specs: {
          hp: 570,
          torque: 637,
          fuel_consumption: 12.1
        },
        tuning_stages: {
          stage1: {
            hp: 650,
            torque: 720,
            price: 15000,
            fuel_improvement: 2,
            estimated_time: "3-4 saat",
            required_mods: []
          },
          stage2: {
            hp: 750,
            torque: 820,
            price: 28000,
            fuel_improvement: -1,
            estimated_time: "6-7 saat",
            required_mods: ["Downpipe", "Intercooler", "Intake"]
          },
          stage3: {
            hp: 1000,
            torque: 1000,
            price: 55000,
            fuel_improvement: -5,
            estimated_time: "12-15 saat",
            required_mods: ["Turbo Upgrade", "Injectors", "Fuel System", "Transmission"]
          }
        },
        ecu_info: {
          type: "Nissan ECM",
          difficulty: "Hard",
          read_method: "Bench"
        },
        notes: "Godzilla! Ekstrem Force performans mümkün"
      },
      {
        id: 9,
        brand: "Tesla",
        model: "Model S Plaid",
        year: 2022,
        engine: "Electric Triple Motor",
        displacement: 0,
        fuel_type: "Elektrik",
        original_specs: {
          hp: 1020,
          torque: 1420,
          fuel_consumption: 0
        },
        tuning_stages: {
          stage1: {
            hp: 1150,
            torque: 1550,
            price: 25000,
            fuel_improvement: 5,
            estimated_time: "4-6 saat",
            required_mods: []
          },
          stage2: {
            hp: 1300,
            torque: 1700,
            price: 45000,
            fuel_improvement: 2,
            estimated_time: "8-10 saat",
            required_mods: ["Cooling System", "Battery Management"]
          },
          stage3: {
            hp: 1500,
            torque: 1900,
            price: 80000,
            fuel_improvement: -2,
            estimated_time: "15-20 saat",
            required_mods: ["Motor Upgrade", "Inverter", "Battery Pack"]
          }
        },
        ecu_info: {
          type: "Tesla MCU",
          difficulty: "Expert",
          read_method: "CAN"
        },
        notes: "Elektrikli Force tuning, gelecek burada!"
      },
      {
        id: 10,
        brand: "Lamborghini",
        model: "Huracán EVO",
        year: 2020,
        engine: "5.2 V10",
        displacement: 5204,
        fuel_type: "Benzin",
        original_specs: {
          hp: 640,
          torque: 600,
          fuel_consumption: 13.7
        },
        tuning_stages: {
          stage1: {
            hp: 720,
            torque: 680,
            price: 20000,
            fuel_improvement: 2,
            estimated_time: "4-5 saat",
            required_mods: []
          },
          stage2: {
            hp: 800,
            torque: 750,
            price: 38000,
            fuel_improvement: -1,
            estimated_time: "7-8 saat",
            required_mods: ["Exhaust System", "Cold Air Intake"]
          },
          stage3: {
            hp: 900,
            torque: 820,
            price: 70000,
            fuel_improvement: -4,
            estimated_time: "12-15 saat",
            required_mods: ["Supercharger", "Fuel System", "Internals"]
          }
        },
        ecu_info: {
          type: "Bosch Motronic",
          difficulty: "Expert",
          read_method: "Bench"
        },
        notes: "İtalyan süper car, premium Force tuning"
      },
      {
        id: 11,
        brand: "McLaren",
        model: "720S",
        year: 2019,
        engine: "4.0 Twin Turbo V8",
        displacement: 3994,
        fuel_type: "Benzin",
        original_specs: {
          hp: 720,
          torque: 770,
          fuel_consumption: 12.8
        },
        tuning_stages: {
          stage1: {
            hp: 800,
            torque: 850,
            price: 22000,
            fuel_improvement: 1,
            estimated_time: "4-6 saat",
            required_mods: []
          },
          stage2: {
            hp: 900,
            torque: 950,
            price: 42000,
            fuel_improvement: -2,
            estimated_time: "8-10 saat",
            required_mods: ["Downpipe", "Intercooler"]
          },
          stage3: {
            hp: 1000,
            torque: 1050,
            price: 75000,
            fuel_improvement: -5,
            estimated_time: "15-18 saat",
            required_mods: ["Turbo Upgrade", "Fuel System", "ECU"]
          }
        },
        ecu_info: {
          type: "McLaren TAG",
          difficulty: "Expert",
          read_method: "CAN"
        },
        notes: "İngiliz mühendislik harikası, Force teknoloji"
      },
      {
        id: 12,
        brand: "Ferrari",
        model: "F8 Tributo",
        year: 2021,
        engine: "3.9 Twin Turbo V8",
        displacement: 3902,
        fuel_type: "Benzin",
        original_specs: {
          hp: 720,
          torque: 770,
          fuel_consumption: 12.2
        },
        tuning_stages: {
          stage1: {
            hp: 800,
            torque: 850,
            price: 25000,
            fuel_improvement: 1,
            estimated_time: "5-6 saat",
            required_mods: []
          },
          stage2: {
            hp: 880,
            torque: 920,
            price: 45000,
            fuel_improvement: -2,
            estimated_time: "8-10 saat",
            required_mods: ["Exhaust System", "Air Filter"]
          },
          stage3: {
            hp: 950,
            torque: 1000,
            price: 80000,
            fuel_improvement: -4,
            estimated_time: "15-20 saat",
            required_mods: ["Turbo Upgrade", "Fuel System", "Internals"]
          }
        },
        ecu_info: {
          type: "Bosch Motronic",
          difficulty: "Expert",
          read_method: "Bench"
        },
        notes: "Prancing Horse, İtalyan Force sanatı"
      },
      {
        id: 13,
        brand: "Bugatti",
        model: "Chiron",
        year: 2020,
        engine: "8.0 Quad Turbo W16",
        displacement: 7993,
        fuel_type: "Benzin",
        original_specs: {
          hp: 1500,
          torque: 1600,
          fuel_consumption: 22.5
        },
        tuning_stages: {
          stage1: {
            hp: 1650,
            torque: 1750,
            price: 50000,
            fuel_improvement: 0,
            estimated_time: "8-10 saat",
            required_mods: []
          },
          stage2: {
            hp: 1800,
            torque: 1900,
            price: 100000,
            fuel_improvement: -3,
            estimated_time: "15-20 saat",
            required_mods: ["Exhaust System", "Intercooler"]
          },
          stage3: {
            hp: 2000,
            torque: 2100,
            price: 200000,
            fuel_improvement: -8,
            estimated_time: "25-30 saat",
            required_mods: ["Turbo Upgrade", "Fuel System", "Transmission"]
          }
        },
        ecu_info: {
          type: "Bosch Motronic",
          difficulty: "Master",
          read_method: "Bench"
        },
        notes: "Dünyanın en hızlı arabası, Force sınırları zorluyor"
      },
      {
        id: 14,
        brand: "Koenigsegg",
        model: "Jesko",
        year: 2021,
        engine: "5.0 Twin Turbo V8",
        displacement: 5065,
        fuel_type: "Benzin",
        original_specs: {
          hp: 1600,
          torque: 1500,
          fuel_consumption: 18.9
        },
        tuning_stages: {
          stage1: {
            hp: 1750,
            torque: 1650,
            price: 60000,
            fuel_improvement: -1,
            estimated_time: "10-12 saat",
            required_mods: []
          },
          stage2: {
            hp: 1900,
            torque: 1800,
            price: 120000,
            fuel_improvement: -5,
            estimated_time: "20-25 saat",
            required_mods: ["Exhaust System", "Fuel System"]
          },
          stage3: {
            hp: 2200,
            torque: 2000,
            price: 250000,
            fuel_improvement: -10,
            estimated_time: "30-40 saat",
            required_mods: ["Engine Rebuild", "Turbo Upgrade", "Transmission"]
          }
        },
        ecu_info: {
          type: "Koenigsegg Custom",
          difficulty: "Master",
          read_method: "CAN"
        },
        notes: "İsveç hypercar teknolojisi, Force limitleri aşıyor"
      },
      {
        id: 15,
        brand: "Pagani",
        model: "Huayra BC",
        year: 2020,
        engine: "6.0 Twin Turbo V12",
        displacement: 5980,
        fuel_type: "Benzin",
        original_specs: {
          hp: 790,
          torque: 1100,
          fuel_consumption: 15.4
        },
        tuning_stages: {
          stage1: {
            hp: 880,
            torque: 1200,
            price: 35000,
            fuel_improvement: 0,
            estimated_time: "6-8 saat",
            required_mods: []
          },
          stage2: {
            hp: 980,
            torque: 1300,
            price: 65000,
            fuel_improvement: -3,
            estimated_time: "12-15 saat",
            required_mods: ["Exhaust System", "Intercooler"]
          },
          stage3: {
            hp: 1100,
            torque: 1450,
            price: 120000,
            fuel_improvement: -7,
            estimated_time: "20-25 saat",
            required_mods: ["Turbo Upgrade", "Fuel System", "Internals"]
          }
        },
        ecu_info: {
          type: "Bosch Motronic",
          difficulty: "Master",
          read_method: "Bench"
        },
        notes: "İtalyan sanat eseri, Force mükemmellik"
      }
    ]
  }
};
      ,
      {
        id: 16,
        brand: "Skoda",
        model: "Octavia RS",
        year: 2021,
        engine: "2.0 TSI",
        displacement: 1984,
        fuel_type: "Benzin",
        original_specs: {
          hp: 245,
          torque: 370,
          fuel_consumption: 7.4
        },
        tuning_stages: {
          stage1: {
            hp: 290,
            torque: 420,
            price: 8800,
            fuel_improvement: 8,
            estimated_time: "2-3 saat",
            required_mods: []
          },
          stage2: {
            hp: 330,
            torque: 470,
            price: 16500,
            fuel_improvement: 4,
            estimated_time: "4-5 saat",
            required_mods: ["Downpipe", "Intercooler"]
          },
          stage3: {
            hp: 380,
            torque: 520,
            price: 28000,
            fuel_improvement: 1,
            estimated_time: "6-8 saat",
            required_mods: ["Turbo Upgrade", "Injectors", "Clutch"]
          }
        },
        ecu_info: {
          type: "Bosch MED17",
          difficulty: "Easy",
          read_method: "OBD"
        },
        notes: "Çek hot hatch, Force ile mükemmel sonuçlar"
      },
      {
        id: 17,
        brand: "SEAT",
        model: "Leon Cupra",
        year: 2020,
        engine: "2.0 TSI",
        displacement: 1984,
        fuel_type: "Benzin",
        original_specs: {
          hp: 300,
          torque: 400,
          fuel_consumption: 7.8
        },
        tuning_stages: {
          stage1: {
            hp: 350,
            torque: 450,
            price: 9200,
            fuel_improvement: 7,
            estimated_time: "2-3 saat",
            required_mods: []
          },
          stage2: {
            hp: 400,
            torque: 500,
            price: 17500,
            fuel_improvement: 3,
            estimated_time: "4-5 saat",
            required_mods: ["Downpipe", "Cold Air Intake"]
          },
          stage3: {
            hp: 450,
            torque: 550,
            price: 30000,
            fuel_improvement: 0,
            estimated_time: "6-8 saat",
            required_mods: ["Turbo Upgrade", "Intercooler", "Fuel System"]
          }
        },
        ecu_info: {
          type: "Bosch MED17",
          difficulty: "Easy",
          read_method: "OBD"
        },
        notes: "İspanyol hot hatch, Force tuning ile güçlü performans"
      },
      {
        id: 18,
        brand: "Renault",
        model: "Megane RS",
        year: 2019,
        engine: "1.8 TCe",
        displacement: 1798,
        fuel_type: "Benzin",
        original_specs: {
          hp: 280,
          torque: 390,
          fuel_consumption: 8.1
        },
        tuning_stages: {
          stage1: {
            hp: 320,
            torque: 440,
            price: 8500,
            fuel_improvement: 6,
            estimated_time: "2-3 saat",
            required_mods: []
          },
          stage2: {
            hp: 360,
            torque: 480,
            price: 16000,
            fuel_improvement: 3,
            estimated_time: "4-5 saat",
            required_mods: ["Downpipe", "Intercooler"]
          },
          stage3: {
            hp: 420,
            torque: 540,
            price: 28500,
            fuel_improvement: 0,
            estimated_time: "6-8 saat",
            required_mods: ["Turbo Upgrade", "Injectors", "Fuel System"]
          }
        },
        ecu_info: {
          type: "Continental",
          difficulty: "Medium",
          read_method: "OBD"
        },
        notes: "Fransız hot hatch, Force ile agresif performans"
      },
      {
        id: 19,
        brand: "Peugeot",
        model: "308 GTi",
        year: 2020,
        engine: "1.6 THP",
        displacement: 1598,
        fuel_type: "Benzin",
        original_specs: {
          hp: 270,
          torque: 330,
          fuel_consumption: 7.5
        },
        tuning_stages: {
          stage1: {
            hp: 310,
            torque: 380,
            price: 8200,
            fuel_improvement: 8,
            estimated_time: "2-3 saat",
            required_mods: []
          },
          stage2: {
            hp: 350,
            torque: 420,
            price: 15500,
            fuel_improvement: 5,
            estimated_time: "4-5 saat",
            required_mods: ["Downpipe", "Cold Air Intake"]
          },
          stage3: {
            hp: 400,
            torque: 480,
            price: 27000,
            fuel_improvement: 2,
            estimated_time: "6-8 saat",
            required_mods: ["Turbo Upgrade", "Intercooler", "Fuel System"]
          }
        },
        ecu_info: {
          type: "Bosch MED17",
          difficulty: "Medium",
          read_method: "OBD"
        },
        notes: "Fransız kompakt performans, Force ile güçlü"
      },
      {
        id: 20,
        brand: "Lucid",
        model: "Air Dream Edition",
        year: 2022,
        engine: "Dual Motor Electric",
        displacement: 0,
        fuel_type: "Elektrik",
        original_specs: {
          hp: 1111,
          torque: 1390,
          fuel_consumption: 0
        },
        tuning_stages: {
          stage1: {
            hp: 1250,
            torque: 1500,
            price: 35000,
            fuel_improvement: 8,
            estimated_time: "6-8 saat",
            required_mods: []
          },
          stage2: {
            hp: 1400,
            torque: 1650,
            price: 65000,
            fuel_improvement: 5,
            estimated_time: "10-12 saat",
            required_mods: ["Cooling System", "Battery Management"]
          },
          stage3: {
            hp: 1600,
            torque: 1800,
            price: 120000,
            fuel_improvement: 2,
            estimated_time: "18-22 saat",
            required_mods: ["Motor Upgrade", "Inverter", "Battery Pack"]
          }
        },
        ecu_info: {
          type: "Lucid ECU",
          difficulty: "Master",
          read_method: "CAN"
        },
        notes: "Amerikan elektrikli lüks sedan, Force ile 1600+ HP"
      }
    ]
  }
};