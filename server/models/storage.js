import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_SOCIETIES, INITIAL_EVENTS, INITIAL_PAST_EVENTS, getInitialAdmins, getInitialStudents } from '../seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON(filename, defaultValue) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
    return defaultValue;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}, returning default`, err);
    return defaultValue;
  }
}

function writeJSON(filename, data) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, filePath);
}

class StorageRepository {
  constructor() {
    this.initialized = false;
  }

  async init(forceSeed = false) {
    ensureDataDir();
    const societiesPath = path.join(DATA_DIR, 'societies.json');
    const needSeed = forceSeed || !fs.existsSync(societiesPath);

    if (needSeed) {
      console.log('🌱 Seeding KIIT Society Hub database with initial records...');
      writeJSON('societies.json', INITIAL_SOCIETIES);
      writeJSON('events.json', INITIAL_EVENTS);
      writeJSON('past_events.json', INITIAL_PAST_EVENTS);
      
      const admins = await getInitialAdmins();
      writeJSON('admins.json', admins);

      const students = await getInitialStudents();
      writeJSON('users.json', students);

      const initialRegistrations = [
        {
          id: 'reg-sample-1',
          userId: 'usr-student-1',
          eventId: 'evt-gdsc-workshop',
          registeredAt: new Date().toISOString(),
          userSnapshot: {
            name: 'Asim',
            email: '251551179@kiit.ac.in',
            rollNumber: '251551179',
            branch: 'Computer Science & Engineering',
            year: '2nd Year'
          }
        }
      ];
      writeJSON('registrations.json', initialRegistrations);
    }

    this.initialized = true;
    this.printAdminCodes();
  }

  printAdminCodes() {
    const societies = this.getSocieties();
    console.log('\n============================================================');
    console.log('🏛️  KIIT SOCIETY HUB — ACTIVE SOCIETIES & ADMIN CODES FOR TESTING');
    console.log('============================================================');
    console.log('Default Admin Password for all pre-seeded codes: kiitadmin2026');
    console.log('------------------------------------------------------------');
    societies.forEach((s, idx) => {
      console.log(`${idx + 1}. [${s.category}] ${s.name}`);
      console.log(`   Admin Code : ${s.adminCode}`);
      console.log(`   Admin Email: admin.${s.id.replace('soc-', '')}@kiit.ac.in`);
    });
    console.log('------------------------------------------------------------');
    console.log('Student Login:');
    console.log('Email: 251551179@kiit.ac.in | Password: asim1179');
    console.log('============================================================\n');
  }

  // SOCIETIES
  getSocieties(filter) {
    let list = readJSON('societies.json', INITIAL_SOCIETIES);
    if (filter?.category && filter.category !== 'All') {
      list = list.filter(s => s.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q));
    }
    return list;
  }

  getSocietyById(id) {
    const list = this.getSocieties();
    return list.find(s => s.id === id) || null;
  }

  getSocietyByAdminCode(code) {
    const list = this.getSocieties();
    return list.find(s => s.adminCode.toUpperCase() === code.trim().toUpperCase()) || null;
  }

  updateSociety(id, updates) {
    const list = this.getSocieties();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;

    list[idx] = {
      ...list[idx],
      ...updates,
      id: list[idx].id,
      adminCode: list[idx].adminCode
    };
    writeJSON('societies.json', list);
    return list[idx];
  }

  // EVENTS
  getEvents(filter) {
    let list = readJSON('events.json', INITIAL_EVENTS);
    const societies = this.getSocieties();
    const societyMap = new Map(societies.map(s => [s.id, s]));

    if (filter?.societyId) {
      list = list.filter(e => e.societyId === filter.societyId);
    }
    if (filter?.category && filter.category !== 'All') {
      list = list.filter(e => e.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.fullDescription.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
    }

    if (filter?.sort === 'date-desc') {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return list.map(e => ({
      ...e,
      societyName: societyMap.get(e.societyId)?.name || 'KIIT Society',
      societyLogo: societyMap.get(e.societyId)?.logo || '/images/logos/default.svg'
    }));
  }

  getEventById(id) {
    const list = readJSON('events.json', INITIAL_EVENTS);
    const event = list.find(e => e.id === id);
    if (!event) return null;

    const society = this.getSocietyById(event.societyId) || undefined;
    return { ...event, society };
  }

  createEvent(eventData) {
    const list = readJSON('events.json', INITIAL_EVENTS);
    const newEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    list.push(newEvent);
    writeJSON('events.json', list);
    return newEvent;
  }

  updateEvent(id, updates) {
    const list = readJSON('events.json', INITIAL_EVENTS);
    const idx = list.findIndex(e => e.id === id);
    if (idx === -1) return null;

    list[idx] = {
      ...list[idx],
      ...updates,
      id: list[idx].id,
      societyId: list[idx].societyId
    };
    writeJSON('events.json', list);
    return list[idx];
  }

  deleteEvent(id) {
    let list = readJSON('events.json', INITIAL_EVENTS);
    const originalLength = list.length;
    list = list.filter(e => e.id !== id);
    if (list.length === originalLength) return false;

    writeJSON('events.json', list);

    let registrations = readJSON('registrations.json', []);
    registrations = registrations.filter(r => r.eventId !== id);
    writeJSON('registrations.json', registrations);

    return true;
  }

  // PAST EVENTS
  getPastEvents(societyId) {
    let list = readJSON('past_events.json', INITIAL_PAST_EVENTS);
    if (societyId) {
      list = list.filter(p => p.societyId === societyId);
    }
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return list;
  }

  createPastEvent(data) {
    const list = readJSON('past_events.json', INITIAL_PAST_EVENTS);
    const newPastEvent = {
      ...data,
      id: `past-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    list.push(newPastEvent);
    writeJSON('past_events.json', list);
    return newPastEvent;
  }

  deletePastEvent(id) {
    let list = readJSON('past_events.json', INITIAL_PAST_EVENTS);
    const originalLength = list.length;
    list = list.filter(p => p.id !== id);
    if (list.length === originalLength) return false;

    writeJSON('past_events.json', list);
    return true;
  }

  // USERS
  getUsers() {
    return readJSON('users.json', []);
  }

  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  }

  getUserByRollNumber(rollNumber) {
    const users = this.getUsers();
    return users.find(u => u.rollNumber.trim() === rollNumber.trim()) || null;
  }

  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      ...userData,
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      role: 'student',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeJSON('users.json', users);
    return newUser;
  }

  updateUser(id, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;

    users[idx] = {
      ...users[idx],
      ...updates
    };
    writeJSON('users.json', users);
    return users[idx];
  }

  // ADMINS
  getAdmins() {
    return readJSON('admins.json', []);
  }

  getAdminByCode(code) {
    const admins = this.getAdmins();
    return admins.find(a => a.adminCode.toUpperCase() === code.trim().toUpperCase()) || null;
  }

  getAdminById(id) {
    const admins = this.getAdmins();
    return admins.find(a => a.id === id) || null;
  }

  getAdminBySocietyId(societyId) {
    const admins = this.getAdmins();
    return admins.find(a => a.societyId === societyId) || null;
  }

  createOrUpdateAdmin(data) {
    const admins = this.getAdmins();
    const existingIdx = admins.findIndex(a => a.adminCode === data.adminCode || a.societyId === data.societyId);

    if (existingIdx !== -1) {
      admins[existingIdx] = {
        ...admins[existingIdx],
        email: data.email,
        passwordHash: data.passwordHash
      };
      writeJSON('admins.json', admins);
      return admins[existingIdx];
    }

    const newAdmin = {
      id: `admin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      societyId: data.societyId,
      adminCode: data.adminCode,
      email: data.email,
      passwordHash: data.passwordHash,
      role: 'society_admin',
      createdAt: new Date().toISOString()
    };
    admins.push(newAdmin);
    writeJSON('admins.json', admins);
    return newAdmin;
  }

  // REGISTRATIONS
  getRegistrations() {
    return readJSON('registrations.json', []);
  }

  getRegistrationsByUser(userId) {
    const list = this.getRegistrations().filter(r => r.userId === userId);
    const events = this.getEvents();
    const eventMap = new Map(events.map(e => [e.id, e]));

    return list.map(r => ({
      ...r,
      event: eventMap.get(r.eventId)
    }));
  }

  getRegistrationsByEvent(eventId) {
    return this.getRegistrations().filter(r => r.eventId === eventId);
  }

  isRegistered(userId, eventId) {
    const list = this.getRegistrations();
    return list.some(r => r.userId === userId && r.eventId === eventId);
  }

  createRegistration(userId, eventId, userSnapshot) {
    const list = this.getRegistrations();
    if (this.isRegistered(userId, eventId)) {
      throw new Error('User is already registered for this event');
    }

    const reg = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      eventId,
      registeredAt: new Date().toISOString(),
      userSnapshot
    };
    list.push(reg);
    writeJSON('registrations.json', list);
    return reg;
  }

  deleteRegistration(registrationId, userId) {
    let list = this.getRegistrations();
    const originalLength = list.length;
    list = list.filter(r => !(r.id === registrationId && r.userId === userId));
    if (list.length === originalLength) return false;

    writeJSON('registrations.json', list);
    return true;
  }
}

export const db = new StorageRepository();
