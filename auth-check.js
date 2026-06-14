// auth-check.js - Dodaj v vsak Pro dokument
const SUPABASE_URL = 'https://jgogoroloaykrmtnyxgh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_CxbeAKCs1dFKAmqOc6uCwA_NrZuq-rP';

async function checkProAccess() {
  const { createClient } = window.supabase;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Ni prijavljen - preusmeri na prijavo
    window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
    return false;
  }
  
  // Preveri Pro status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', session.user.id)
    .single();
  
  if (!profile || !profile.is_pro) {
    // Ni Pro - pokaži upgrade stran
    showUpgradeOverlay();
    return false;
  }
  
  return true;
}

function showUpgradeOverlay() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(240,245,255,0.97);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; font-family: 'Plus Jakarta Sans', sans-serif;
  `;
  overlay.innerHTML = `
    <div style="background:white;border:1.5px solid #e0e8ff;border-radius:16px;padding:2.5rem;max-width:400px;text-align:center;box-shadow:0 4px 20px rgba(61,126,255,.1)">
      <div style="font-size:2.5rem;margin-bottom:1rem">🔒</div>
      <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:.5rem">Pro plan potreben</h2>
      <p style="color:#6b7280;font-size:.88rem;margin-bottom:1.5rem;line-height:1.6">Ta dokument je na voljo samo za Pro uporabnike. Nadgradite za dostop do vseh dokumentov.</p>
      <div style="background:#f0f5ff;border-radius:10px;padding:1rem;margin-bottom:1.5rem">
        <div style="font-size:.75rem;color:#6b7280;margin-bottom:.25rem">PRO PLAN</div>
        <div style="font-size:1.8rem;font-weight:700">8.99€<span style="font-size:.85rem;font-weight:400;color:#6b7280">/mes</span></div>
        <div style="font-size:.75rem;color:#2e7d32;margin-top:.25rem">🎉 Prvi mesec samo 7.19€</div>
      </div>
      <a href="https://buy.stripe.com/4gM5kCdEffBndQbawM6Ri02" style="display:block;background:#3d7eff;color:white;padding:.85rem;border-radius:10px;text-decoration:none;font-weight:700;font-size:.95rem;margin-bottom:.75rem">Nadgradi na Pro →</a>
      <a href="index.html" style="display:block;color:#6b7280;font-size:.83rem;text-decoration:none">← Nazaj na glavno stran</a>
    </div>
  `;
  document.body.appendChild(overlay);
}

// Zaženi preverjanje ko se stran naloži
document.addEventListener('DOMContentLoaded', checkProAccess);
