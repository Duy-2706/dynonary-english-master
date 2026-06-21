const vocabSetService = require('../services/vocabSet.service');

exports.getMyVocabSets = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const sets = await vocabSetService.getMyVocabSets(req.user.accountId);
    return res.status(200).json({ sets });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getVocabSet = async (req, res) => {
  try {
    const set = await vocabSetService.getVocabSetById(req.params.id);
    if (!set) return res.status(404).json({ message: 'Không tìm thấy bộ từ' });
    return res.status(200).json({ set });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getVocabSetWords = async (req, res) => {
  try {
    const set = await vocabSetService.getVocabSetById(req.params.id);
    if (!set) return res.status(404).json({ message: 'Không tìm thấy bộ từ' });
    return res.status(200).json({ words: set.words || [] });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.createVocabSet = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const set = await vocabSetService.createVocabSet(req.user.accountId, req.user.name || '', req.body);
    return res.status(201).json({ set });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.updateVocabSet = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    const set = await vocabSetService.updateVocabSet(req.params.id, req.user.accountId, req.body);
    return res.status(200).json({ set });
  } catch (error) {
    if (error.message === 'Không có quyền') return res.status(403).json({ message: error.message });
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.deleteVocabSet = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    await vocabSetService.deleteVocabSet(req.params.id, req.user.accountId);
    return res.status(200).json({ ok: true });
  } catch (error) {
    if (error.message === 'Không có quyền') return res.status(403).json({ message: error.message });
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};

exports.getClassroomVocabSets = async (req, res) => {
  try {
    const sets = await vocabSetService.getClassroomVocabSets(req.params.id);
    return res.status(200).json({ sets });
  } catch (error) {
    return res.status(503).json({ message: 'Lỗi dịch vụ' });
  }
};
