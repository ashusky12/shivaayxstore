const fs = require('fs');
const path = require('path');

// 1. Add Pulse Dot keyframes to style.css
const stylePath = path.join(__dirname, '..', 'style.css');
let styleContent = fs.readFileSync(stylePath, 'utf8');

const pulseStyle = `
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.4; }
  100% { transform: scale(1); opacity: 1; }
}
.pulse-dot {
  animation: pulse 1.2s infinite ease-in-out;
}
`;

if (!styleContent.includes("pulse-dot")) {
  styleContent += pulseStyle;
  fs.writeFileSync(stylePath, styleContent, 'utf8');
  console.log("Added pulse animation to style.css!");
}

// 2. Modify app.js
const appPath = path.join(__dirname, '..', 'app.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Update boot Crisp message received listener to handle files (images/audio) from operator
const oldCrispInit = `  // Global listener for replies sent by the admin from Crisp App
  $crisp.push(["on", "message:received", (message) => {
    if (message && message.content) {
      const hash = window.location.hash;
      if (hash.startsWith("#/tickets/")) {
        const ticketId = hash.split("/")[2];
        const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
        const currentTicket = freshTickets.find(t => t.id === ticketId);
        if (currentTicket) {
          const text = message.content;
          const time = new Date().toISOString();
          
          // Check for duplicate messages
          const exists = currentTicket.messages.some(m => m.text === text && m.sender === 'bot');
          if (!exists) {
            currentTicket.messages.push({
              sender: 'bot', // Appends as received bubble
              text: text,
              time: time
            });
            localStorage.setItem("ShivaayX_tickets", JSON.stringify(freshTickets));
            renderSingleTicket(ticketId); // Refresh custom chatbox screen
            
            // POST Crisp reply to central MongoDB so it is permanently synced
            fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sender: 'admin',
                text: text
              })
            }).catch(err => console.error("Error saving Crisp reply to DB:", err));
          }
        }
      }
    }
  }]);`;

const newCrispInit = `  // Global listener for replies sent by the admin from Crisp App (handles text, images & audio!)
  $crisp.push(["on", "message:received", (message) => {
    if (message) {
      const hash = window.location.hash;
      if (hash.startsWith("#/tickets/")) {
        const ticketId = hash.split("/")[2];
        const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
        const currentTicket = freshTickets.find(t => t.id === ticketId);
        if (currentTicket) {
          const isFile = message.type === 'file' || (message.content && typeof message.content === 'object' && message.content.url);
          let text = "";
          
          if (isFile) {
            const fileData = message.content;
            const url = fileData.url;
            const mime = fileData.mime || '';
            if (mime.startsWith('image/')) {
              text = \`<img src="\${url}" style="max-width: 100%; border-radius: 8px; max-height: 240px; object-fit: contain; margin-top: 0.25rem;">\`;
            } else if (mime.startsWith('audio/')) {
              text = \`<audio src="\${url}" controls style="max-width: 100%; border-radius: 8px; margin-top: 0.25rem;"></audio>\`;
            } else {
              text = \`<a href="\${url}" target="_blank" style="color: var(--color-blood); text-decoration: underline;">📄 \${fileData.name || 'Attachment'}</a>\`;
            }
          } else {
            text = message.content;
          }
          
          if (!text) return;
          const time = new Date().toISOString();
          
          // Check for duplicate messages
          const exists = currentTicket.messages.some(m => m.text === text && m.sender === 'bot');
          if (!exists) {
            currentTicket.messages.push({
              sender: 'bot', // Appends as received bubble
              text: text,
              time: time
            });
            localStorage.setItem("ShivaayX_tickets", JSON.stringify(freshTickets));
            renderSingleTicket(ticketId); // Refresh custom chatbox screen
            
            // POST Crisp reply to central MongoDB so it is permanently synced
            fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sender: 'admin',
                text: text
              })
            }).catch(err => console.error("Error saving Crisp reply to DB:", err));
          }
        }
      }
    }
  }]);`;

if (appContent.includes(oldCrispInit)) {
  appContent = appContent.replace(oldCrispInit, newCrispInit);
  console.log("Updated Crisp incoming message handler to support attachments!");
} else {
  console.log("WARNING: Crisp incoming message handler match failed!");
}

// 3. Update inputBarHtml markup inside renderSingleTicket
const oldInputBarHtml = `    inputBarHtml = \`
      <form class="chat-form" id="chat-input-form">
        <input type="text" class="form-control" placeholder="Type a message..." id="chat-input" required autocomplete="off">
        <button type="submit" class="btn btn-primary"><i data-lucide="send"></i></button>
      </form>
    \`;`;

const newInputBarHtml = `    inputBarHtml = \`
      <form class="chat-form" id="chat-input-form" style="display: flex; gap: 0.5rem; align-items: center; width: 100%;">
        <input type="file" id="chat-file-input" accept="image/*,audio/*" style="display: none;">
        
        <button type="button" class="btn btn-ghost btn-sm" id="btn-chat-file" style="padding: 0.5rem; display: flex; align-items: center; justify-content: center; height: 38px; width: 38px; border-radius: 8px;" title="Attach file">
          <i data-lucide="paperclip" style="width: 18px; height: 18px; color: var(--color-ink-300);"></i>
        </button>

        <button type="button" class="btn btn-ghost btn-sm" id="btn-chat-mic" style="padding: 0.5rem; display: flex; align-items: center; justify-content: center; height: 38px; width: 38px; border-radius: 8px;" title="Record audio">
          <i data-lucide="mic" style="width: 18px; height: 18px; color: var(--color-ink-300);" id="mic-icon"></i>
        </button>

        <input type="text" class="form-control" placeholder="Type a message..." id="chat-input" required autocomplete="off" style="flex: 1; height: 38px;">
        <button type="submit" class="btn btn-primary" style="height: 38px; width: 38px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px;"><i data-lucide="send" style="width: 16px; height: 16px;"></i></button>
      </form>
      <div id="recording-status" style="display: none; font-size: 0.8125rem; color: var(--color-blood); margin-top: 0.5rem; align-items: center; gap: 0.375rem; padding-left: 0.5rem;">
        <span class="pulse-dot" style="width: 8px; height: 8px; background-color: var(--color-blood); border-radius: 50%;"></span>
        <span id="recording-timer" style="font-weight: bold; color: var(--color-ink-100);">00:00</span>
        <span style="color: var(--color-ink-300);">Recording... Click mic again to stop & send.</span>
      </div>
    \`;`;

if (appContent.includes(oldInputBarHtml)) {
  appContent = appContent.replace(oldInputBarHtml, newInputBarHtml);
  console.log("Successfully replaced chat form inputBarHtml with paperclip & mic buttons!");
} else {
  console.log("WARNING: inputBarHtml match failed!");
}

// 4. Append File & Voice Recorder event listeners right after attaching chatForm event listener in app.js
const oldFormListenerCode = `  // --- Attach Chat Event Listeners ---
  const chatForm = document.getElementById("chat-input-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-input");
      const messageText = input.value.trim();
      if (!messageText) return;
      
      input.value = "";
      sendUserMessage(messageText);
    });
  }`;

const newFormAndMediaListenersCode = `  // --- Attach Chat Event Listeners ---
  const chatForm = document.getElementById("chat-input-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-input");
      const messageText = input.value.trim();
      if (!messageText) return;
      
      input.value = "";
      sendUserMessage(messageText);
    });
  }

  // File Upload Event Listeners
  const fileInput = document.getElementById("chat-file-input");
  const fileBtn = document.getElementById("btn-chat-file");
  if (fileBtn && fileInput) {
    fileBtn.addEventListener("click", () => fileInput.click());
    
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Upload to Crisp CDN (triggers Crisp event and sends to operator)
      if (typeof $crisp !== 'undefined') {
        $crisp.push(["do", "message:upload", [file]]);
      }
      
      // Load locally as Data URL and render to our chat window immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        let mediaHtml = "";
        if (file.type.startsWith("image/")) {
          mediaHtml = \`<img src="\${dataUrl}" style="max-width: 100%; border-radius: 8px; max-height: 240px; object-fit: contain; margin-top: 0.25rem;">\`;
        } else if (file.type.startsWith("audio/")) {
          mediaHtml = \`<audio src="\${dataUrl}" controls style="max-width: 100%; border-radius: 8px; margin-top: 0.25rem;"></audio>\`;
        } else {
          mediaHtml = \`<a href="\${dataUrl}" download="\${file.name}" style="color: var(--color-blood); text-decoration: underline;">📄 \${file.name}</a>\`;
        }
        
        const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
        const currentTicket = freshTickets.find(t => t.id === ticketId);
        if (currentTicket) {
          currentTicket.messages.push({
            sender: "user",
            text: mediaHtml,
            time: new Date().toISOString()
          });
          localStorage.setItem("ShivaayX_tickets", JSON.stringify(freshTickets));
          renderSingleTicket(ticketId); // Re-render chat
          
          // POST media text snippet to central MongoDB so that history stays saved
          fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sender: 'buyer',
              text: \`[Attached File: \${file.name}]\`
            })
          }).catch(err => console.error(err));
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Voice Note Recording (MediaRecorder API) Event Listeners
  const micBtn = document.getElementById("btn-chat-mic");
  if (micBtn) {
    micBtn.addEventListener("click", () => {
      if (window.ShivaayX_mediaRecorder && window.ShivaayX_mediaRecorder.state === "recording") {
        stopVoiceRecording();
      } else {
        startVoiceRecording();
      }
    });
  }

  function startVoiceRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        window.ShivaayX_recordingStream = stream;
        window.ShivaayX_mediaRecorder = new MediaRecorder(stream);
        window.ShivaayX_audioChunks = [];
        
        window.ShivaayX_mediaRecorder.ondataavailable = e => {
          window.ShivaayX_audioChunks.push(e.data);
        };
        
        window.ShivaayX_mediaRecorder.onstop = () => {
          const audioBlob = new Blob(window.ShivaayX_audioChunks, { type: 'audio/webm' });
          const voiceFile = new File([audioBlob], \`voice_note_\${Date.now()}.webm\`, { type: 'audio/webm' });
          
          // Upload voice note file to Crisp CDN
          if (typeof $crisp !== 'undefined') {
            $crisp.push(["do", "message:upload", [voiceFile]]);
          }
          
          // Render local audio player in chat logs instantly
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result;
            const freshTickets = JSON.parse(localStorage.getItem("ShivaayX_tickets") || "[]");
            const currentTicket = freshTickets.find(t => t.id === ticketId);
            if (currentTicket) {
              currentTicket.messages.push({
                sender: "user",
                text: \`<audio src="\${dataUrl}" controls style="max-width: 100%; border-radius: 8px; margin-top: 0.25rem;"></audio>\`,
                time: new Date().toISOString()
              });
              localStorage.setItem("ShivaayX_tickets", JSON.stringify(freshTickets));
              renderSingleTicket(ticketId); // Re-render
              
              // Sync with MongoDB
              fetch(\`\${getApiUrl()}/api/tickets/\${ticketId}/messages\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  sender: 'buyer',
                  text: '[Voice Note Recording]'
                })
              }).catch(err => console.error(err));
            }
          };
          reader.readAsDataURL(audioBlob);
          
          // Release microphone hardware
          stream.getTracks().forEach(track => track.stop());
        };
        
        window.ShivaayX_mediaRecorder.start();
        
        // Visual indicator updates
        const recStatus = document.getElementById("recording-status");
        if (recStatus) recStatus.style.display = "flex";
        
        const micIcon = document.getElementById("mic-icon");
        if (micIcon) micIcon.style.color = "var(--color-blood)";
        
        let recStartTime = Date.now();
        window.ShivaayX_recordingInterval = setInterval(() => {
          const elapsed = Math.floor((Date.now() - recStartTime) / 1000);
          const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
          const secs = String(elapsed % 60).padStart(2, '0');
          const timerSpan = document.getElementById("recording-timer");
          if (timerSpan) timerSpan.textContent = \`\${mins}:\${secs}\`;
        }, 1000);
      })
      .catch(err => {
        console.error("Mic error:", err);
        showToast("Microphone access denied or not supported.", "error");
      });
  }

  function stopVoiceRecording() {
    if (window.ShivaayX_mediaRecorder && window.ShivaayX_mediaRecorder.state === "recording") {
      window.ShivaayX_mediaRecorder.stop();
    }
    if (window.ShivaayX_recordingInterval) {
      clearInterval(window.ShivaayX_recordingInterval);
    }
    const recStatus = document.getElementById("recording-status");
    if (recStatus) recStatus.style.display = "none";
    
    const micIcon = document.getElementById("mic-icon");
    if (micIcon) micIcon.style.color = "var(--color-ink-300)";
  }`;

if (appContent.includes(oldFormListenerCode)) {
  appContent = appContent.replace(oldFormListenerCode, newFormAndMediaListenersCode);
  console.log("Successfully added attachment and voice recording event listeners!");
} else {
  console.log("WARNING: FormListenerCode match failed!");
}

fs.writeFileSync(appPath, appContent, 'utf8');
