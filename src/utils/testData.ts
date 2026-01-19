// PRODUCTION ADMIN ACCOUNTS - SABİT HESAPLAR
export function getAdminAccounts() {
  // Her zaman bu hesapları döndür - localStorage'a bağlı değil
  return {
    'nexaven-core': { 
      email: 'admin@nexavencore.com', 
      password: 'NexavenAdmin2026!',
      name: 'Nexaven Core Admin',
      service: 'nexaven-core',
      role: 'admin'
    },
    'zorlu-ecu': { 
      email: 'admin@zorluecu.com', 
      password: 'ZorluECU2026!',
      name: 'Zorlu ECU Admin',
      service: 'zorlu-ecu',
      role: 'admin'
    },
    'ahmet-kanar': { 
      email: 'admin@ahmetkanar.com', 
      password: 'AhmetKanar2026!',
      name: 'Ahmet KANAR Admin',
      service: 'ahmet-kanar',
      role: 'admin'
    }
  }
}

// Teknisyen hesabı
export function getTechnicianAccounts() {
  return {
    'zorlu-ecu': {
      email: 'technician@zorluecu.com',
      password: 'technician123',
      name: 'Zorlu Teknisyeni',
      code: 'technician123',
      service: 'zorlu-ecu',
      role: 'technician'
    }
  }
}

// Örnek araçlar
export function getDefaultVehicles() {
  return [
    {
      id: '1',
      plate: '34ABC123',
      brand: 'BMW',
      model: '320i',
      year: 2018,
      engine: '2.0D',
      customer: 'Yahya Öner',
      phone: '+90 555 000 0001',
      status: 'completed',
      totalCost: 2500,
      paidAmount: 2500,
      debt: 0,
      serviceType: 'Stage 1 ECU',
      notes: 'Tamamlandı'
    },
    {
      id: '2',
      plate: '35XYZ789',
      brand: 'Ford',
      model: 'Focus',
      year: 2019,
      engine: '1.5T',
      customer: 'Mehmet Yılmaz',
      phone: '+90 555 000 0002',
      status: 'processing',
      totalCost: 1200,
      paidAmount: 600,
      debt: 600,
      serviceType: 'DPF Delete',
      notes: 'İşleniyor'
    }
  ]
}

