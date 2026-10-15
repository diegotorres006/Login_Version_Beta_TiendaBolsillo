// Lógica de Estado e Interfaz Web de Tienda Bolsillo
document.addEventListener('DOMContentLoaded', () => {
  // Estado Global de la Interfaz
  const state = {
    currentView: 'login-view',
    selectedRole: null, // 'cliente' | 'negocio'
    location: {
      provincia: '',
      canton: '',
      parroquia: '',
      lat: null,
      lng: null,
      isMapPinned: false
    },
    businessActivity: null
  };

  // Referencias DOM
  const views = {
    login: document.getElementById('view-login'),
    roleSelection: document.getElementById('view-role-selection'),
    createBusiness: document.getElementById('view-create-business')
  };

  // Función de Navegación entre Vistas
  window.navigateTo = function(viewId) {
    Object.values(views).forEach(view => {
      if (view) {
        view.classList.remove('active');
        view.style.display = 'none';
      }
    });

    const target = document.getElementById(viewId);
    if (target) {
      target.style.display = 'block';
      setTimeout(() => {
        target.classList.add('active');
      }, 20);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      state.currentView = viewId;
    }
  };

  // Inicializar en Login
  navigateTo('view-login');

  // Alternar Visibilidad de Contraseñas (Show/Hide)
  window.togglePassword = function(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input) return;

    if (input.type === 'password') {
      input.type = 'text';
      if (icon) {
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />`;
      }
    } else {
      input.type = 'password';
      if (icon) {
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
      }
    }
  };

  // Selección de Rol
  window.selectRole = function(role) {
    state.selectedRole = role;
    const cards = document.querySelectorAll('.role-card');
    cards.forEach(card => card.classList.remove('selected'));

    const selectedCard = document.getElementById(`role-${role}`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }

    if (role === 'negocio') {
      setTimeout(() => {
        navigateTo('view-create-business');
        initEcuadorLocations();
      }, 180);
    } else {
      showToast('Registro de Cliente seleccionado (Próximamente disponible)');
    }
  };

  // Poblar Dropdowns geográficos de Ecuador
  function initEcuadorLocations() {
    const provSelect = document.getElementById('select-provincia');
    const cantonSelect = document.getElementById('select-canton');
    const parroquiaSelect = document.getElementById('select-parroquia');

    if (!provSelect || provSelect.children.length > 1) return;

    // Cargar provincias
    Object.keys(ECUADOR_LOCATIONS).sort().forEach(prov => {
      const opt = document.createElement('option');
      opt.value = prov;
      opt.textContent = prov;
      provSelect.appendChild(opt);
    });

    provSelect.addEventListener('change', () => {
      state.location.provincia = provSelect.value;
      cantonSelect.innerHTML = '<option value="">Seleccione un cantón *</option>';
      parroquiaSelect.innerHTML = '<option value="">Seleccione una parroquia *</option>';
      cantonSelect.disabled = !provSelect.value;
      parroquiaSelect.disabled = true;

      if (provSelect.value && ECUADOR_LOCATIONS[provSelect.value]) {
        const cantones = Object.keys(ECUADOR_LOCATIONS[provSelect.value]).sort();
        cantones.forEach(cant => {
          const opt = document.createElement('option');
          opt.value = cant;
          opt.textContent = cant;
          cantonSelect.appendChild(opt);
        });
      }
      validateBusinessForm();
    });

    cantonSelect.addEventListener('change', () => {
      state.location.canton = cantonSelect.value;
      parroquiaSelect.innerHTML = '<option value="">Seleccione una parroquia *</option>';
      parroquiaSelect.disabled = !cantonSelect.value;

      if (cantonSelect.value && ECUADOR_LOCATIONS[provSelect.value] && ECUADOR_LOCATIONS[provSelect.value][cantonSelect.value]) {
        const parroquias = ECUADOR_LOCATIONS[provSelect.value][cantonSelect.value];
        parroquias.forEach(parr => {
          const opt = document.createElement('option');
          opt.value = parr;
          opt.textContent = parr;
          parroquiaSelect.appendChild(opt);
        });
      }
      validateBusinessForm();
    });

    parroquiaSelect.addEventListener('change', () => {
      state.location.parroquia = parroquiaSelect.value;
      validateBusinessForm();
    });
  }

  // Modal de Actividad Comercial
  window.openActivityModal = function() {
    const modal = document.getElementById('modal-activity');
    const list = document.getElementById('activity-list');
    if (!modal || !list) return;

    list.innerHTML = '';
    COMMERCIAL_ACTIVITIES.forEach(act => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-red-500 hover:bg-red-50/50 flex items-center justify-between transition-all';
      btn.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-red-100/60 text-red-600 flex items-center justify-center font-bold text-sm">
            ${act.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div class="font-semibold text-slate-800 text-sm">${act.name}</div>
          </div>
        </div>
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      `;
      btn.onclick = () => {
        selectActivity(act);
      };
      list.appendChild(btn);
    });

    modal.classList.add('active');
  };

  window.closeActivityModal = function() {
    const modal = document.getElementById('modal-activity');
    if (modal) modal.classList.remove('active');
  };

  function selectActivity(act) {
    state.businessActivity = act;
    const input = document.getElementById('input-actividad');
    if (input) {
      input.value = act.name;
    }
    closeActivityModal();
    validateBusinessForm();
  }

  // Modal Interactivo de Ubicación en el Mapa
  window.openMapModal = function() {
    const modal = document.getElementById('modal-map');
    if (modal) modal.classList.add('active');
  };

  window.closeMapModal = function() {
    const modal = document.getElementById('modal-map');
    if (modal) modal.classList.remove('active');
  };

  window.confirmLocation = function() {
    // Generar o confirmar coordenadas de la ubicación seleccionada
    state.location.lat = -0.1807 + (Math.random() * 0.01 - 0.005);
    state.location.lng = -78.4678 + (Math.random() * 0.01 - 0.005);
    state.location.isMapPinned = true;

    const btn = document.getElementById('btn-map-trigger');
    const badge = document.getElementById('map-status-badge');
    if (btn) {
      btn.classList.remove('bg-red-600', 'hover:bg-red-700');
      btn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
      btn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Ubicación fijada correctamente</span>
      `;
    }
    if (badge) {
      badge.classList.remove('hidden');
      badge.textContent = `Coordenadas: ${state.location.lat.toFixed(4)}, ${state.location.lng.toFixed(4)}`;
    }

    closeMapModal();
    showToast('📍 Punto GPS del comercio registrado');
    validateBusinessForm();
  };

  // Validación Reactiva del Formulario de Creación de Negocio
  window.validateBusinessForm = function() {
    const email = document.getElementById('biz-email')?.value.trim();
    const pass = document.getElementById('biz-password')?.value;
    const passConfirm = document.getElementById('biz-password-confirm')?.value;
    const name = document.getElementById('biz-name')?.value.trim();
    const phone = document.getElementById('biz-phone')?.value.trim();
    const activity = document.getElementById('input-actividad')?.value;
    const provincia = document.getElementById('select-provincia')?.value;
    const canton = document.getElementById('select-canton')?.value;
    const parroquia = document.getElementById('select-parroquia')?.value;
    const terms = document.getElementById('check-terminos')?.checked;
    const privacy = document.getElementById('check-privacidad')?.checked;

    const submitBtn = document.getElementById('btn-submit-business');
    if (!submitBtn) return;

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPassValid = pass && pass.length >= 6;
    const isPassMatch = pass === passConfirm;
    const isNameValid = name && name.length >= 3;
    const isPhoneValid = phone && phone.length >= 7;
    const isActivityValid = !!activity;
    const isLocationValid = provincia && canton && parroquia;
    const isTermsAccepted = terms && privacy;

    // Validación de contraseñas visual
    const passMatchMsg = document.getElementById('password-match-msg');
    if (passMatchMsg && passConfirm) {
      if (!isPassMatch) {
        passMatchMsg.textContent = 'Las contraseñas no coinciden';
        passMatchMsg.classList.remove('text-emerald-600', 'hidden');
        passMatchMsg.classList.add('text-red-500');
      } else {
        passMatchMsg.textContent = '✓ Contraseñas coinciden';
        passMatchMsg.classList.remove('text-red-500', 'hidden');
        passMatchMsg.classList.add('text-emerald-600');
      }
    }

    const isFormReady = isEmailValid && isPassValid && isPassMatch && isNameValid && 
                        isPhoneValid && isActivityValid && isLocationValid && isTermsAccepted;

    submitBtn.disabled = !isFormReady;
    return isFormReady;
  };

  // Event Listeners para Validación en Vivo
  const formInputs = [
    'biz-email', 'biz-password', 'biz-password-confirm',
    'biz-name', 'biz-phone', 'check-terminos', 'check-privacidad'
  ];
  formInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', validateBusinessForm);
      el.addEventListener('change', validateBusinessForm);
    }
  });

  // Envío de Formulario (Simulación Frontend Completa)
  const formBiz = document.getElementById('form-create-business');
  if (formBiz) {
    formBiz.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateBusinessForm()) {
        showToast('Por favor completa todos los campos requeridos (*)', 'error');
        return;
      }

      const submitBtn = document.getElementById('btn-submit-business');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Registrando negocio...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Registrar negocio';
        openSuccessModal();
      }, 1200);
    });
  }

  // Login Form Submission
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value;
      const pass = document.getElementById('login-password')?.value;
      if (!email || !pass) {
        showToast('Ingresa tu correo y contraseña', 'error');
        return;
      }
      showToast(`¡Bienvenido a Tienda Bolsillo! Iniciando sesión...`);
    });
  }

  // Modal de Éxito
  window.openSuccessModal = function() {
    const modal = document.getElementById('modal-success');
    if (modal) modal.classList.add('active');
  };

  window.closeSuccessModal = function() {
    const modal = document.getElementById('modal-success');
    if (modal) modal.classList.remove('active');
    navigateTo('view-login');
  };

  // Toast Notification Utility
  window.showToast = function(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'bg-red-600' : 'bg-slate-900'}`;
    toast.innerHTML = `
      <svg class="w-5 h-5 ${type === 'error' ? 'text-red-200' : 'text-emerald-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${type === 'error' ? 
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />' : 
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />'}
      </svg>
      <span>${msg}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };
});
