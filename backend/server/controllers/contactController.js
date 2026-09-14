import Contact from '../models/Contact.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create contact entry
    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: contact
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error.message
    });
  }
};
