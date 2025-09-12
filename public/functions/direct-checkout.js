// public/functions/direct-checkout.js - FINAL & COMPLETE VERSION

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const buyNowBtn = document.getElementById('buy-now-btn');
    const drawer = document.getElementById('direct-checkout-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const closeBtn = document.getElementById('drawer-close-btn');
    const panel = document.getElementById('drawer-panel');
    const itemDisplay = document.getElementById('drawer-item-display');
    const wilayaSelect = document.getElementById('drawer-wilaya');
    const totalPriceEl = document.getElementById('drawer-total-price');
    const confirmBtn = document.getElementById('drawer-confirm-order-btn');
    const form = document.getElementById('direct-checkout-form');
    
    const deliveryMethodRadios = document.querySelectorAll('input[name="deliveryMethod"]');
    const stopDeskLabel = document.getElementById('drawer-stopdesk-label');
    const stopDeskRadio = document.getElementById('drawer-delivery-stopdesk');
    const addressContainer = document.getElementById('drawer-address-container');
    const stopDeskContainer = document.getElementById('drawer-stopdesk-container');
    const stopDeskInfoDiv = document.getElementById('drawer-stopdesk-info');


     const formatPrice = (price) => {
        const currentLang = document.documentElement.lang || 'ar';
        const currency = currentLang === 'ar' ? 'د.ج' : 'DA';
        return `${parseFloat(price).toFixed(2)} ${currency}`;
    };


    let shippingData = [];
    let currentItem = null;

    
    let finalShippingCost = 0; // <-- ADD THIS LINE
    const fetchShippingData = async () => {
        try {
            const response = await fetch('/api/shipping-info');
            if (!response.ok) throw new Error('Failed to fetch shipping data');
            shippingData = await response.json();
            populateWilayas();
        } catch (error) {
            console.error(error);
        }
    };

     const populateWilayas = () => {
        if (!wilayaSelect) return;
        // --- NEW: Get current language from the HTML tag ---
        const currentLang = document.documentElement.lang || 'ar';
        const placeholderText = currentLang === 'ar' ? 'اختر ولايتك' : 'Sélectionnez votre wilaya';
        
        wilayaSelect.innerHTML = `<option value="" disabled selected>${placeholderText}</option>`;
        shippingData.forEach(wilaya => {
            const option = document.createElement('option');
            // --- NEW: Use the French name as the value for consistency ---
            option.value = wilaya.name.fr; 
            // --- NEW: Display the name in the current language ---
            option.textContent = wilaya.name[currentLang] || wilaya.name.fr;
            wilayaSelect.appendChild(option);
        });
    };

    const handleDeliveryMethodChange = () => {
        const selectedMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
        if (selectedMethod === 'stopdesk') {
            addressContainer.style.display = 'none';
            addressContainer.querySelector('textarea').required = false;
            stopDeskContainer.style.display = 'block';
        } else {
            addressContainer.style.display = 'block';
            addressContainer.querySelector('textarea').required = true;
            stopDeskContainer.style.display = 'none';
        }
        updateTotalPrice();
    };

    const updateStopDeskInfo = () => {
        const selectedWilayaName = wilayaSelect.value;
         const wilaya = shippingData.find(w => w.name.fr === selectedWilayaName);

        if (wilaya && wilaya.hasStopdesk) {
            stopDeskLabel.classList.remove('disabled');
            stopDeskRadio.disabled = false;
            stopDeskInfoDiv.innerHTML = `
                <p>${wilaya.stopdeskInfo.address}</p>
                <a href="${wilaya.stopdeskInfo.gmaps}" target="_blank" rel="noopener noreferrer">Voir sur Google Maps</a>
            `;
        } else {
            stopDeskLabel.classList.add('disabled');
            stopDeskRadio.disabled = true;
            if (document.querySelector('input[name="deliveryMethod"]:checked').value === 'stopdesk') {
                document.getElementById('drawer-delivery-home').checked = true;
                handleDeliveryMethodChange();
            }
            stopDeskInfoDiv.innerHTML = `<p>Le service Stop Desk n'est pas disponible pour cette wilaya.</p>`;
        }
    };

     const updateTotalPrice = () => {
        if (!currentItem || !totalPriceEl || !wilayaSelect) return;

        const quantity = parseInt(document.getElementById('quantity-display')?.textContent || '1', 10);
        const subtotal = parseFloat(currentItem.price) * quantity;
        
        const selectedWilayaName = wilayaSelect.value;
        const selectedWilaya = shippingData.find(w => w.name.fr === selectedWilayaName);
        const selectedMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;

        let originalShippingCost = 0;
        if (selectedWilaya) {
            originalShippingCost = selectedMethod === 'stopdesk' && selectedWilaya.hasStopdesk 
                ? parseFloat(selectedWilaya.stopdeskPrice) 
                : parseFloat(selectedWilaya.homePrice);
        }

        if (subtotal > 10000) {
            finalShippingCost = 0;
        } else if (subtotal > 7900) {
            if (selectedMethod === 'stopdesk') {
                finalShippingCost = 0;
            } else {
                finalShippingCost = Math.max(0, originalShippingCost - 400);
            }
        } else {
            finalShippingCost = originalShippingCost;
        }

        const total = subtotal + finalShippingCost;
        const originalPriceEl = document.getElementById('drawer-original-shipping-price');
        
        if (selectedWilaya && finalShippingCost < originalShippingCost) {
            const originalTotal = subtotal + originalShippingCost;
            originalPriceEl.textContent = formatPrice(originalTotal);
            originalPriceEl.style.display = 'inline';
        } else {
            originalPriceEl.style.display = 'none';
        }
        
        totalPriceEl.textContent = formatPrice(total);
    };


    const openDrawer = () => {
        if (!drawer || !buyNowBtn) return;

        currentItem = {
            id: buyNowBtn.dataset.itemId,
            name: buyNowBtn.dataset.itemName,
            price: parseFloat(buyNowBtn.dataset.itemPrice),
            image: buyNowBtn.dataset.itemImage,
            isPack: buyNowBtn.dataset.isPack === 'true'
        };
        
        const quantity = parseInt(document.getElementById('quantity-display')?.textContent || '1', 10);

        itemDisplay.innerHTML = `
            <img src="${currentItem.image}" alt="${currentItem.name}" class="drawer-item-image">
            <div class="drawer-item-details">
                <div class="drawer-item-name">${quantity} x ${currentItem.name}</div>
                <div class="drawer-item-price">${formatPrice(currentItem.price * quantity)}</div>
            </div>
        `;
        
        const isLoggedIn = typeof USER_DETAILS !== 'undefined' && USER_DETAILS !== null;
    if (isLoggedIn && USER_DETAILS.shippingInfo) {
        const info = USER_DETAILS.shippingInfo;
        document.getElementById('drawer-fullName').value = info.fullName || '';
        document.getElementById('drawer-phone').value = info.phone || '';
        document.getElementById('drawer-address').value = info.address || '';
        
        if (info.wilaya) {
            // Use a short timeout to ensure the wilayas have been populated by fetchShippingData
            setTimeout(() => {
                const wilayaDropdown = document.getElementById('drawer-wilaya');
                wilayaDropdown.value = info.wilaya;
                // Manually trigger the change event to update shipping costs and Stop Desk info
                wilayaDropdown.dispatchEvent(new Event('change'));
            }, 100);
        }
    }
    // ==================================================
    //            END: PRE-FILLING LOGIC
    // ==================================================

    document.getElementById('drawer-delivery-home').checked = true;
    handleDeliveryMethodChange();
    updateStopDeskInfo();
    updateTotalPrice();
    
    drawer.classList.add('active');
    document.body.classList.add('no-scroll');
};

    const closeDrawer = () => {
        if (!drawer) return;
        drawer.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    // --- CUSTOM VALIDATION & FORM SUBMISSION LOGIC ---
    const validateDrawerForm = () => {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        form.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
        });

        requiredFields.forEach(field => {
            const parentGroup = field.closest('.form-group');
            // Check if the field is visible and empty
            if (window.getComputedStyle(parentGroup).display !== 'none' && !field.value.trim()) {
                isValid = false;
                if (parentGroup) {
                    parentGroup.classList.add('error');
                }
            }
        });

        return isValid;
    };

    const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateDrawerForm()) {
        return;
    }

    confirmBtn.disabled = true;
    confirmBtn.textContent = window.translations.sending;

    const formData = new FormData(form);
    
    const customerPayload = {
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        wilaya: formData.get('wilaya'),
        deliveryMethod: formData.get('deliveryMethod'),
        address: formData.get('deliveryMethod') === 'home' ? formData.get('address') : ''
    };
    
    const itemPayload = {
        ...currentItem,
        quantity: parseInt(document.getElementById('quantity-display')?.textContent || '1', 10)
    };

    try {
        const response = await fetch('/create-direct-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                customer: customerPayload, 
                item: itemPayload,
                shippingCost: finalShippingCost
            })
        });

        const result = await response.json();

        if (!response.ok) {
            let errorMessage = result.message || 'Une erreur est survenue.';
            if (result.errors && result.errors.length > 0) {
                errorMessage = result.errors.map(err => err.msg).join('\n');
            }
            throw new Error(errorMessage);
        }

        closeDrawer();
        window.showToast(window.translations.orderReceived);
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);

    } catch (error) {
        console.error('Direct order submission error:', error);
        alert(`Erreur: ${error.message}`);
        confirmBtn.disabled = false;
        confirmBtn.textContent = window.translations.confirmOrder;
    }
};

    // --- Event Listeners ---
    if (buyNowBtn) buyNowBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
    if (form) form.addEventListener('submit', handleFormSubmit);
    
    if (wilayaSelect) {
        wilayaSelect.addEventListener('change', () => {
            updateTotalPrice();
            updateStopDeskInfo();
        });
    }

    deliveryMethodRadios.forEach(radio => {
        radio.addEventListener('change', handleDeliveryMethodChange);
    });

    document.getElementById('quantity-plus')?.addEventListener('click', updateTotalPrice);
    document.getElementById('quantity-minus')?.addEventListener('click', updateTotalPrice);

    fetchShippingData();
});