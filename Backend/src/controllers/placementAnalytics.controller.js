const placementAnalyticsService = require('../services/placementAnalytics.service');
const PlacementAnalytics = require('../models/placementAnalytics.model');

/**
 * Controller for CareerAI Placement Analytics & Predictive Offer Intelligence
 */
class PlacementAnalyticsController {
    /**
     * Get candidate's comprehensive placement analytics and offer probabilities
     * GET /api/analytics
     */
    async getAnalytics(req, res) {
        try {
            const userId = req.user._id;
            const result = await placementAnalyticsService.getCandidateAnalytics(userId);
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error in getAnalytics:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to calculate placement analytics.'
            });
        }
    }

    /**
     * Run interactive What-If Sensitivity Simulation
     * POST /api/analytics/simulate-what-if
     */
    async simulateWhatIf(req, res) {
        try {
            const userId = req.user._id;
            const adjustments = req.body || {};

            // Retrieve base gates from database or compute fresh
            let existingDoc = await PlacementAnalytics.findOne({ user: userId });
            let baseGates;
            if (existingDoc && existingDoc.recruitmentGates?.length > 0) {
                baseGates = existingDoc.recruitmentGates.map(g => g.toObject());
            } else {
                const fresh = await placementAnalyticsService.getCandidateAnalytics(userId);
                baseGates = fresh.analytics.recruitmentGates.map(g => g.toObject ? g.toObject() : g);
            }

            const baseT1 = existingDoc?.tierProbabilities?.find(t => t.tierKey === 'TIER_1_PRODUCT')?.probabilityPercentage || 10;
            const baseMedian = existingDoc?.predictedCtc?.medianLpa || 4.5;

            const simulationResult = placementAnalyticsService.simulateWhatIf(baseGates, {
                ...adjustments,
                baseTier1: baseT1,
                baseMedianCtc: baseMedian
            });

            return res.status(200).json({
                success: true,
                data: simulationResult
            });
        } catch (error) {
            console.error('Error in simulateWhatIf:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to run What-If simulation.'
            });
        }
    }

    /**
     * Public verification endpoint for CareerAI Placement Credential
     * GET /api/analytics/verify/:token
     */
    async verifyCredential(req, res) {
        try {
            const { token } = req.params;
            if (!token) {
                return res.status(400).json({ success: false, message: 'Verification token is required.' });
            }

            const doc = await PlacementAnalytics.findOne({ 'verificationDossier.verificationToken': token })
                .populate('user', 'username email');

            if (!doc) {
                return res.status(404).json({
                    success: false,
                    message: 'Placement credential not found or invalid token.'
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    isAuthentic: true,
                    candidateName: doc.user?.username || 'Verified Candidate',
                    token: doc.verificationDossier.verificationToken,
                    issuedAt: doc.verificationDossier.issuedAt,
                    marketReadinessScore: doc.overallMarketReadinessScore,
                    topTierFit: doc.topTierFit,
                    predictedCtc: doc.predictedCtc.formattedRange,
                    verifiedGates: doc.recruitmentGates.map(g => ({
                        gate: g.displayName,
                        status: g.status,
                        score: g.score
                    }))
                }
            });
        } catch (error) {
            console.error('Error in verifyCredential:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to verify credential.'
            });
        }
    }
}

module.exports = new PlacementAnalyticsController();
