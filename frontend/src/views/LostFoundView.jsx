import React, { useState, useEffect } from 'react';
import { Plus, X, Camera, Image, Trash2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Vue Objets Perdus & Trouvés avec formulaire de signalement et filtrage
 */
const LostFoundView = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('LOST'); // 'LOST' ou 'FOUND'
  const [showModal, setShowModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    contactInfo: '',
    status: 'LOST',
  });

  const locationOptions = [
    { value: 'Tribune Nord', label: t('loc_tribune_nord') },
    { value: 'Tribune Sud', label: t('loc_tribune_sud') },
    { value: 'Food Court', label: t('loc_food_court') },
    { value: 'Toilettes A', label: t('loc_toilettes_a') },
    { value: 'Porte Principale', label: t('loc_porte_principale') },
    { value: 'Boutique Officielle', label: t('loc_boutique_officielle') },
    { value: 'Autre', label: t('loc_autre') },
  ];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/items`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Erreur de chargement', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setShowModal(false);
      setFormData({ title: '', description: '', location: '', contactInfo: '', status: 'LOST' });
      setPhotoPreview(null);
      fetchItems();
    } catch (err) {
      console.error('Erreur lors de la soumission', err);
    }
  };

  const filteredItems = items.filter((item) => item.status === activeTab);

  // Formatage relatif du temps traduit
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const diff = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60));
    if (diff < 1) return t('time_just_now');
    if (diff === 1) return t('time_one_hour');
    if (diff < 24) return t('time_hours_ago', { count: diff });
    return t('time_days_ago', { count: Math.floor(diff / 24) });
  };

  return (
    <div className="animate-fade-in flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white pt-6 pb-2 px-4 shadow-sm z-10 sticky top-0 rounded-b-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('lostfound_title')}</h1>
        
        {/* Sélecteur d'onglet Perdu / Trouvé */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-2">
          <button
            onClick={() => setActiveTab('LOST')}
            className={`flex-1 min-h-12 py-3 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'LOST' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('tab_lost')}
          </button>
          <button
            onClick={() => setActiveTab('FOUND')}
            className={`flex-1 min-h-12 py-3 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'FOUND' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('tab_found')}
          </button>
        </div>
      </div>

      <div className="p-4 flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white rounded-2xl shadow-sm border border-gray-100 px-6">
            <p className="text-lg font-medium text-gray-700 mb-2">
              {activeTab === 'LOST' ? t('no_items_lost') : t('no_items_found')}
            </p>
            <p className="text-sm">
              {activeTab === 'LOST' ? t('no_items_hint_lost') : t('no_items_hint_found')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className={`absolute top-0 left-0 rtl:left-auto rtl:right-0 w-1.5 h-full ${activeTab === 'LOST' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                <div className="pl-3 rtl:pl-0 rtl:pr-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                      {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-xl">
                    <div>
                      <p className="text-gray-400 text-xs font-medium mb-0.5">{t('card_location')}</p>
                      <p className="font-semibold text-gray-700">{item.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-medium mb-0.5">{t('card_contact')}</p>
                      <p className="font-semibold text-gray-700 truncate">{item.contactInfo}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB déplacé vers le haut (bottom-36) pour ne pas chevaucher le bouton SOS (bottom-20) */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-36 right-5 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-40 border-2 border-white/80"
        aria-label={t('btn_report')}
      >
        <Plus size={28} />
      </button>

      {/* Modal / Formulaire de signalement */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-0">
          <div className="bg-white w-full sm:w-[420px] rounded-t-3xl sm:rounded-3xl p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{t('btn_report')}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-800"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('form_report_type')}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'LOST' })}
                    className={`flex-1 min-h-12 py-3 rounded-xl text-sm font-bold transition-all border ${
                      formData.status === 'LOST' 
                        ? 'bg-red-50 border-red-500 text-red-700' 
                        : 'bg-white border-gray-200 text-gray-500'
                    }`}
                  >
                    {t('btn_lost')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'FOUND' })}
                    className={`flex-1 min-h-12 py-3 rounded-xl text-sm font-bold transition-all border ${
                      formData.status === 'FOUND' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                        : 'bg-white border-gray-200 text-gray-500'
                    }`}
                  >
                    {t('btn_found')}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('form_title')}
                </label>
                <input
                  required
                  type="text"
                  placeholder={t('form_title_placeholder')}
                  className="w-full min-h-12 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all text-[15px]"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('form_details')}
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={t('form_details_placeholder')}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all text-[15px] resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('form_location')}
                </label>
                <select
                  required
                  className="w-full min-h-12 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all text-[15px]"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  <option value="" disabled>{t('form_location_select')}</option>
                  {locationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('form_contact')}
                </label>
                <input
                  required
                  type="text"
                  placeholder={t('form_contact_placeholder')}
                  className="w-full min-h-12 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all text-[15px]"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                />
              </div>

              {/* Champ photo / appareil photo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Photo de l'objet (Optionnel)
                </label>
                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-300 aspect-video max-h-36 bg-gray-900 flex items-center justify-center">
                    <img src={photoPreview} alt="Aperçu objet" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-full shadow hover:bg-red-700 transition-colors"
                      title="Supprimer la photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-2xl p-4 cursor-pointer bg-gray-50 hover:bg-emerald-50/40 transition-colors">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                      <Camera size={20} />
                      <span>Prendre une photo / Galerie</span>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 5 Mo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <button
                type="submit"
                className="w-full min-h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg mt-6 active:scale-[0.98] transition-transform text-lg"
              >
                {t('form_submit')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostFoundView;
