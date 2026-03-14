/* eslint-disable no-use-before-define */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, X } from 'lucide-react';
import { useValves } from '../context/ValveContext';

export default function MobileSMSAlert() {
  const navigate = useNavigate();
  const { alerts } = useValves();
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  // Filter to only show undismissed alerts, max 2
  const activeAlerts = alerts
    .filter(alert => !dismissedAlerts.has(alert.id))
    .slice(0, 2)
    .map(alert => ({
      id: alert.id,
      device_id: alert.device_id,
      message: alert.details
    }));

  useEffect(() => {
    // Simulate/Attempt sending real SMS via Twilio for new alerts
    activeAlerts.forEach(alert => {
      const smsSentKey = `sms_sent_${alert.id}`;
      if (!sessionStorage.getItem(smsSentKey)) {
        sendTwilioSMS(alert.message);
        sessionStorage.setItem(smsSentKey, 'true');
      }
    });
  }, [activeAlerts.map(a => a.id).join(',')]);

  async function sendTwilioSMS(messageText) {
    // In a real app, this should be done via a backend server to protect API keys.
    let userMobile = localStorage.getItem('userMobile');
    
    if (!userMobile) {
      console.warn("No mobile number found for user. Cannot send SMS.");
      return;
    }

    // Automatically format for Indian numbers (+91) if user only typed 10 digits
    if (/^\d{10}$/.test(userMobile.trim())) {
       userMobile = `+91${userMobile.trim()}`;
    }

    const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID || 'AC_DUMMY_SID';
    const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN || 'DUMMY_TOKEN';
    const TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER || '+1234567890';

    if (TWILIO_ACCOUNT_SID === 'AC_DUMMY_SID') {
      console.log(`[Mock SMS Mapped to Twilio] Would send to ${userMobile}: ${messageText}`);
      return; // Stop here since we don't have real keys
    }

    try {
      const formData = new URLSearchParams();
      formData.append('To', userMobile);
      formData.append('From', TWILIO_PHONE_NUMBER);
      formData.append('Body', `OrbiPulse Alert: ${messageText}`);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
        },
        body: formData
      });

      if (response.ok) {
        console.log("Twilio SMS sent successfully!");
      } else {
        console.error("Failed to send Twilio SMS:", await response.text());
      }
    } catch (error) {
      console.error("Error attempting to send Twilio SMS:", error);
    }
  }

  const dismissAlert = (id) => {
    setDismissedAlerts(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  if (activeAlerts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4">
      {activeAlerts.map(alert => (
        <div key={alert.id} className="w-80 bg-main border border-border rounded-2xl shadow-2xl p-4 animate-in slide-in-from-right-8 relative">
          <div className="absolute -top-3 -right-3">
             <button onClick={() => dismissAlert(alert.id)} className="bg-social-bg p-1.5 rounded-full border border-border text-textH/60 hover:text-textH hover:bg-slate-700 transition">
               <X size={14} />
             </button>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-accent/20 text-accent rounded-xl shrink-0">
               <Smartphone size={20} />
            </div>
            <div>
               <div className="text-[10px] uppercase tracking-widest font-black text-textH/40 mb-1 flex items-center gap-2">
                 <span>SMS Notification</span>
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
               </div>
               <div className="font-bold text-textH text-sm mb-1">{alert.device_id} Alert</div>
               <div className="text-textH/70 text-sm leading-snug">{alert.message}</div>
               <div className="text-[10px] text-accent font-semibold mt-2 cursor-pointer hover:underline" onClick={() => { dismissAlert(alert.id); navigate(`/valves/${alert.device_id}`); }}>Reply • View Details</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
