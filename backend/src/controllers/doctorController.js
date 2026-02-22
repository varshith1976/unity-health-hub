const Doctor = require('../models/mongodb/Doctor');
const Specialization = require('../models/mongodb/Specialization');
const User = require('../models/mongodb/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.register = async (req, res) => {
  try {
    const {
      email, password, fullName, phone,
      specialization, qualifications, experienceYears,
      consultationFee, emergencyFee, hospitalName, hospitalAddress, bio,
      languagesSpoken
    } = req.body;

    if (!email || !password || !fullName || !specialization || !qualifications) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'doctor',
      fullName,
      phone
    });

    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      qualifications,
      experienceYears: experienceYears || 0,
      consultationFee: consultationFee || 500,
      emergencyFee: emergencyFee || 1000,
      hospitalName,
      hospitalAddress,
      bio,
      languages: languagesSpoken || ['English']
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, doctorId: doctor._id },
      process.env.JWT_SECRET || 'healthhub_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone
      },
      doctor: {
        id: doctor._id,
        specialization: doctor.specialization,
        qualifications: doctor.qualifications,
        experienceYears: doctor.experienceYears,
        hospitalName: doctor.hospitalName
      }
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({ error: 'Failed to register doctor' });
  }
};

exports.searchDoctors = async (req, res) => {
  try {
    const { specialization, minExperience, maxFee, minRating, availability } = req.query;

    console.log('Search params:', { specialization, minExperience, maxFee, minRating, availability });

    const filters = { isAvailable: true };
    
    // Case-insensitive specialization search
    if (specialization) {
      filters.specialization = { $regex: new RegExp(specialization, 'i') };
    }
    if (minExperience) {
      filters.experienceYears = { $gte: parseInt(minExperience) };
    }
    if (maxFee) {
      filters.consultationFee = { $lte: parseFloat(maxFee) };
    }
    if (minRating) {
      filters.rating = { $gte: parseFloat(minRating) };
    }

    console.log('Filters:', filters);

    const doctors = await Doctor.find(filters)
      .populate('userId', 'fullName email phone')
      .sort({ rating: -1, experienceYears: -1 })
      .limit(10); // Limit to 10 doctors

    console.log('Doctors found:', doctors.length);

    res.json(doctors);
  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({ error: 'Failed to search doctors', details: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const doctorId = req.user.doctorId;
    const doctor = await Doctor.findById(doctorId).populate('userId', '-password');

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const doctorId = req.user.doctorId;
    const updateData = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );

    res.json({ success: true, doctor });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.updateOnlineStatus = async (req, res) => {
  try {
    const doctorId = req.user.doctorId;
    const { isOnline } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { isOnline },
      { new: true }
    );

    res.json({ success: true, isOnline: doctor.isOnline });
  } catch (error) {
    console.error('Update online status error:', error);
    res.status(500).json({ error: 'Failed to update online status' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const doctorId = req.user.doctorId;
    const Appointment = require('../models/mongodb/Appointment');
    
    const totalAppointments = await Appointment.countDocuments({ doctorId });
    const completedAppointments = await Appointment.countDocuments({ doctorId, status: 'completed' });
    const pendingAppointments = await Appointment.countDocuments({ doctorId, status: 'scheduled' });

    res.json({
      totalAppointments,
      completedAppointments,
      pendingAppointments
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const { specialization, minExperience, maxFee, minRating, availability } = req.query;

    const filters = {};
    if (specialization) filters.specialization = specialization;
    if (minExperience) filters.experienceYears = { $gte: parseInt(minExperience) };
    if (maxFee) filters.consultationFee = { $lte: parseFloat(maxFee) };
    if (minRating) filters.rating = { $gte: parseFloat(minRating) };
    if (availability === 'online') filters.isAvailable = true;

    const doctors = await Doctor.find(filters).populate('userId', 'fullName email phone');

    res.json(doctors);
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({ error: 'Failed to get doctors' });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid doctor ID' });
    }
    
    const doctor = await Doctor.findById(id).populate('userId', 'fullName email phone');

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: 'Failed to get doctor details' });
  }
};

exports.getSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find();
    res.json(specializations);
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({ error: 'Failed to get specializations' });
  }
};
