const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

admin.initializeApp();

exports.generateMockICSR = functions
  .region('us-central1')
  .https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ code: 405, message: 'Method not allowed', details: 'Use POST' });
    }

    try {
      const payload = req.body || {};
      // TODO: Validate payload schema

      // TODO: Invoke GPT-ICSRAgent (stub for now)
      const mockICSR = {
        caseId: uuidv4(),
        patientAge: payload.patientAge || 45,
        patientSex: payload.patientSex || 'Unknown',
        drugList: payload.drugNames || [],
        adverseEvents: [],
        meddraCodes: [],
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        generatedByAgent: 'GPT-ICSRAgent'
      };

      await admin.firestore().collection('mock_icsrs').doc(mockICSR.caseId).set(mockICSR);

      return res.status(200).json({ documentId: mockICSR.caseId, data: mockICSR });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ code: 500, message: 'Internal Server Error', details: error.message });
    }
  });
