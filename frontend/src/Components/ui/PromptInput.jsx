import * as React from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "../../lib/utils";

const SPRING_TRANSITION = "max-width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
const SMOOTH_HEIGHT_TRANSITION = "max-width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.15s ease-out";

function MorphingText({ text }) {
  const [width, setWidth] = useState("auto");
  const spanRef = useRef(null);

  useEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth);
    }
  }, [text]);

  return (
    <span
      className="relative inline-flex items-center justify-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
      style={{ width }}
    >
      <span ref={spanRef} className="invisible whitespace-nowrap px-1">{text}</span>
      <span
        key={text}
        className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
        style={{ animation: "fadeInZoom 0.3s ease forwards" }}
      >
        {text}
      </span>
    </span>
  );
}

function ModelIcon({ model, className: cls }) {
  const icons = {
    "NeuroAI Pro": (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6" cy="6" r="2" fill="currentColor" />
      </svg>
    ),
    "Speech Model": (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect x="4" y="1" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 5.5V6a4 4 0 0 0 8 0v-.5M6 10v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    "Phoneme AI": (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M1 6c1-2 2-3 3-3s2 4 3 4 2-3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return (
    <span className={cn("inline-flex items-center justify-center", cls)}>
      {icons[model] || icons["NeuroAI Pro"]}
    </span>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="5" y="1" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.75 6.5V7a4.25 4.25 0 0 0 8.5 0v-.5M7 11.25V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2.5V11.5M2.5 7H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 2.5L11.5 11.5M11.5 2.5L2.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DynamicBarsIcon({ level }) {
  const isMediumOrHigh = level === "Detailed" || level === "Deep Analysis";
  const isHigh = level === "Deep Analysis";
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1.5" y="8" width="2.5" height="4.5" rx="1" fill="currentColor" opacity={1} />
      <rect x="5.75" y="5" width="2.5" height="7.5" rx="1" fill="currentColor" opacity={isMediumOrHigh ? 1 : 0.3} />
      <rect x="10" y="2" width="2.5" height="10.5" rx="1" fill="currentColor" opacity={isHigh ? 1 : 0.3} />
    </svg>
  );
}

function AttachmentThumb({ attachment, index, onRemove, onOpen, registerRef }) {
  const [isHovered, setIsHovered] = useState(false);
  const btnRef = useRef(null);

  return (
    <button
      ref={(el) => {
        btnRef.current = el;
        registerRef(attachment.id, el);
      }}
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (btnRef.current) onOpen(attachment, btnRef.current.getBoundingClientRect());
      }}
      style={{ animationDelay: `${index * 35}ms`, animationFillMode: "backwards" }}
      className="group relative size-12 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white/10 outline-none transition-transform duration-200 hover:scale-[1.04] active:scale-[0.96]"
      aria-label={`Open preview of ${attachment.name}`}
    >
      <img src={attachment.url} alt={attachment.name} className="size-full object-cover" draggable={false} />
      <span className={cn("absolute inset-0 flex items-start justify-end transition-colors duration-200", isHovered && "bg-black/25")}>
        <span
          role="button" tabIndex={-1}
          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onClick={(e) => { e.stopPropagation(); onRemove(attachment.id); }}
          className={cn(
            "m-1 flex size-4 items-center justify-center rounded-full bg-black/70 text-white/70 shadow-sm transition-all duration-200 hover:bg-black hover:text-white hover:scale-110",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
          )}
          aria-label={`Remove ${attachment.name}`}
        >
          <CloseIcon />
        </span>
      </span>
    </button>
  );
}

export const PromptInput = React.forwardRef(function PromptInput(props, ref) {
  const {
    onSubmit,
    placeholder = "Ask anything",
    className,
    models = ["NeuroAI Pro", "Speech Model", "Phoneme AI"],
    efforts = ["Conversational", "Detailed", "Deep Analysis"],
    defaultValue = "",
    value: controlledValue,
    onChange,
    maxAttachments = 6,
  } = props;

  const [expanded, setExpanded] = useState(false);
  const [isSmoothResize, setIsSmoothResize] = useState(false);
  const [localValue, setLocalValue] = useState(defaultValue);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [effortIndex, setEffortIndex] = useState(1);
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [activeAttachment, setActiveAttachment] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState(new Array(5).fill(0));

  const valueRef = useRef(controlledValue !== undefined ? controlledValue : localValue);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const rafRef = useRef(null);
  const recognitionRef = useRef(null);
  const demoIntervalRef = useRef(null);
  const demoTextIntervalRef = useRef(null);

  const [hoverStyle, setHoverStyle] = useState({ opacity: 0, transform: "translateY(0px) scale(0.95)", transition: "none" });
  const [containerHeight, setContainerHeight] = useState(116);
  const [textareaHeight, setTextareaHeight] = useState(68);
  const [isScrolling, setIsScrolling] = useState(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : localValue;
  const hasValue = value.trim() !== "" || attachments.length > 0;
  const hasAttachments = attachments.length > 0;

  const textareaRef = useRef(null);
  const internalContainerRef = useRef(null);
  const topFadeRef = useRef(null);
  const bottomFadeRef = useRef(null);
  const fileInputRef = useRef(null);
  const thumbRefs = useRef(new Map());

  useEffect(() => { valueRef.current = value; }, [value]);

  const updateFades = () => {
    const el = textareaRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (topFadeRef.current) topFadeRef.current.style.opacity = Math.min(scrollTop / 20, 1).toString();
    if (bottomFadeRef.current) {
      const bottomScroll = scrollHeight - clientHeight - scrollTop;
      bottomFadeRef.current.style.opacity = Math.min(Math.max(bottomScroll - 16, 0) / 10, 1).toString();
    }
  };

  const handleValueChange = useCallback((val) => {
    setIsSmoothResize(true);
    if (!isControlled) setLocalValue(val);
    onChange?.(val);
  }, [isControlled, onChange]);

  const expand = () => { setIsSmoothResize(false); setExpanded(true); };

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; }
    if (demoIntervalRef.current) { window.clearInterval(demoIntervalRef.current); demoIntervalRef.current = null; }
    if (demoTextIntervalRef.current) { window.clearInterval(demoTextIntervalRef.current); demoTextIntervalRef.current = null; }
    setIsRecording(false);
    setAudioData(new Array(5).fill(0));
  }, []);

  const startRecording = useCallback(async () => {
    setIsSmoothResize(false);
    setExpanded(true);
    let stream = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (err) {
      console.warn("Microphone access denied, using simulation.");
    }
    setIsRecording(true);

    function simulateText() {
      const fakeText = "Practice the /s/ sound: 'sun', 'sea', 'sit'. How did that feel?";
      const words = fakeText.split(" ");
      let i = 0;
      let currentBase = valueRef.current;
      demoTextIntervalRef.current = window.setInterval(() => {
        if (i < words.length) {
          currentBase = (currentBase ? currentBase + " " : "") + words[i];
          handleValueChange(currentBase);
          i++;
        } else { stopRecording(); }
      }, 300);
    }

    if (stream) {
      streamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVisualizer = () => {
        analyser.getByteFrequencyData(dataArray);
        const bands = new Array(5).fill(0);
        const step = Math.floor(dataArray.length / 5);
        for (let i = 0; i < 5; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) sum += dataArray[i * step + j];
          bands[i] = sum / step / 255;
        }
        setAudioData(bands);
        rafRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        let baseline = valueRef.current;
        recognition.onresult = (event) => {
          let interimTranscript = "";
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            else interimTranscript += event.results[i][0].transcript;
          }
          if (finalTranscript) baseline += (baseline ? " " : "") + finalTranscript;
          handleValueChange((baseline + (interimTranscript ? " " + interimTranscript : "")).trim());
        };
        recognition.onerror = () => stopRecording();
        recognition.onend = () => stopRecording();
        recognitionRef.current = recognition;
        recognition.start();
      } else {
        simulateText();
      }
    } else {
      demoIntervalRef.current = window.setInterval(() => {
        setAudioData(Array.from({ length: 5 }, () => Math.random() * 0.8 + 0.1));
      }, 100);
      simulateText();
    }
  }, [handleValueChange, stopRecording]);

  useEffect(() => {
    if (isRecording && textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [value, isRecording]);

  useEffect(() => {
    return () => {
      stopRecording();
      attachments.forEach((a) => URL.revokeObjectURL(a.url));
    };
  }, [stopRecording, attachments]);

  useEffect(() => {
    if ((value.trim() !== "" || hasAttachments) && !expanded) {
      setIsSmoothResize(false);
      setExpanded(true);
    }
  }, [value, expanded, hasAttachments]);

  useEffect(() => {
    if (expanded && !isRecording) {
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const length = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(length, length);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [expanded, isRecording]);

  useEffect(() => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const currentHeight = el.style.height;
    el.style.transition = "none";
    el.style.height = "0px";
    const scrollHeight = el.scrollHeight;
    el.style.height = currentHeight;
    void el.offsetHeight;
    el.style.transition = "";
    const newHeight = Math.max(68, Math.min(scrollHeight, 160));
    el.style.height = `${newHeight}px`;
    setTextareaHeight(newHeight);
    setIsScrolling(scrollHeight > 160);
    setTimeout(updateFades, 0);
  }, [value, expanded]);

  useEffect(() => {
    setContainerHeight(Math.max(116, textareaHeight + 48));
    setTimeout(updateFades, 0);
  }, [textareaHeight]);

  useEffect(() => {
    if (!isModelSelectOpen) return;
    const handleOutsideClick = (e) => {
      if (internalContainerRef.current && !internalContainerRef.current.contains(e.target)) {
        setIsModelSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isModelSelectOpen]);

  const handleBlur = (e) => {
    if (internalContainerRef.current && internalContainerRef.current.contains(e.relatedTarget)) return;
    if (value.trim() === "" && !hasAttachments && !isRecording) {
      setIsSmoothResize(false);
      setExpanded(false);
      setIsModelSelectOpen(false);
    }
  };

  const handleSubmit = () => {
    if (value.trim() === "" && !hasAttachments) return;
    setIsSmoothResize(false);
    onSubmit?.(value, { model: selectedModel, effort: efforts[effortIndex], attachments: attachments.map((a) => a.file) });
    handleValueChange("");
    attachments.forEach((a) => URL.revokeObjectURL(a.url));
    setAttachments([]);
    setExpanded(false);
    setIsModelSelectOpen(false);
  };

  const cycleEffort = (e) => { e.stopPropagation(); setEffortIndex((prev) => (prev + 1) % efforts.length); };

  const openFileChooser = (e) => { e.stopPropagation(); fileInputRef.current?.click(); };

  const handleFilesChosen = async (e) => {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    e.target.value = "";
    if (files.length === 0) return;
    const room = Math.max(0, maxAttachments - attachments.length);
    const accepted = files.slice(0, room);
    if (!expanded) { setIsSmoothResize(false); setExpanded(true); } else { setIsSmoothResize(true); }
    for (const file of accepted) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => addAttachment(file, url, img.naturalWidth, img.naturalHeight);
      img.onerror = () => addAttachment(file, url, 800, 600);
      img.src = url;
    }
  };

  const addAttachment = (file, url, width, height) => {
    const id = `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;
    setAttachments((prev) => [...prev, { id, file, url, name: file.name, width, height }]);
  };

  const removeAttachment = (id) => {
    setIsSmoothResize(true);
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((a) => a.id !== id);
    });
    thumbRefs.current.delete(id);
  };

  const showArrow = hasValue && !isRecording;
  const showStop = isRecording;
  const showMic = !hasValue && !isRecording;

  const onActionButtonClick = (e) => {
    e.preventDefault();
    if (isRecording) stopRecording();
    else if (hasValue) handleSubmit();
    else startRecording();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .prompt-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; background: transparent; }
        .prompt-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .prompt-scrollbar::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; }
        .prompt-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
        @keyframes fadeInZoom { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}} />
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          internalContainerRef.current = node;
        }}
        onBlur={handleBlur}
        className={cn("relative flex flex-col w-full", className)}
        style={{
          maxWidth: expanded ? 600 : 380,
          transition: isSmoothResize ? "max-width 0.15s ease-out" : "max-width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
      >
        <input
          ref={fileInputRef} type="file" accept="image/*" multiple
          onChange={handleFilesChosen} className="hidden" tabIndex={-1} aria-hidden="true"
        />

        <div
          aria-hidden={!hasAttachments}
          style={{
            height: hasAttachments && expanded ? 68 : 0,
            transition: isSmoothResize ? "height 0.15s ease-out" : "height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
          className="w-full relative z-0 overflow-hidden"
        >
          <div
            style={{
              position: "absolute", bottom: -8, left: 20, right: 20, height: 68,
              transform: hasAttachments && expanded ? "translateY(0)" : "translateY(100%)",
              opacity: hasAttachments && expanded ? 1 : 0,
              transition: isSmoothResize ? "transform 0.15s ease-out, opacity 0.15s ease-out" : "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease-out",
            }}
            className="border border-white/15 border-b-0 bg-white/5 rounded-t-2xl px-2 pt-2 pb-1 flex items-start gap-2 overflow-x-auto prompt-scrollbar"
          >
            {attachments.map((attachment, index) => (
              <AttachmentThumb
                key={attachment.id} attachment={attachment} index={index}
                onRemove={removeAttachment}
                onOpen={(a, rect) => setActiveAttachment({ attachment: a, rect })}
                registerRef={(id, el) => thumbRefs.current.set(id, el)}
              />
            ))}
          </div>
        </div>

        <div
          onMouseDown={(e) => {
            const isTextarea = e.target === textareaRef.current;
            if (expanded && !isTextarea && !isRecording) { e.preventDefault(); textareaRef.current?.focus(); }
          }}
          style={{
            borderRadius: 24,
            height: expanded ? containerHeight : 48,
            transition: isSmoothResize ? SMOOTH_HEIGHT_TRANSITION : SPRING_TRANSITION,
            overflow: expanded ? "visible" : "hidden",
          }}
          className={cn(
            "relative w-full border border-white/15 bg-white/5 backdrop-blur-xl shadow-sm focus-within:border-indigo-500/40 focus-within:ring-1 focus-within:ring-indigo-500/20 hover:border-white/25 z-10",
            expanded ? "cursor-text" : "cursor-default"
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            onScroll={updateFades}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
              if (e.key === "Escape" && value.trim() === "" && !hasAttachments) {
                setIsSmoothResize(false); setExpanded(false); setIsModelSelectOpen(false);
              }
            }}
            placeholder={placeholder}
            aria-label="Prompt"
            disabled={isRecording}
            style={{
              transition: isSmoothResize
                ? "height 0.15s ease-out"
                : "opacity 0.3s ease-out, transform 0.3s ease-out, height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}
            className={cn(
              "prompt-scrollbar absolute top-0 inset-x-0 z-[1] w-full resize-none bg-transparent pl-4 pr-12 py-3.5 text-sm leading-[22px] text-white outline-none placeholder:font-medium placeholder:text-white/40 cursor-text font-inter",
              expanded ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
              isScrolling ? "overflow-y-auto" : "overflow-y-hidden",
              isRecording && "pointer-events-none"
            )}
          />

          <div ref={topFadeRef} className="absolute left-4 right-12 top-0 z-[2] h-8 bg-gradient-to-b from-white/5 via-white/3 to-transparent pointer-events-none" />
          <div
            ref={bottomFadeRef}
            className="absolute left-4 right-12 z-[2] h-8 bg-gradient-to-t from-white/5 via-white/3 to-transparent pointer-events-none"
            style={{
              opacity: 0, top: `${textareaHeight - 32}px`,
              transition: isSmoothResize ? "top 0.15s ease-out" : "top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}
          />

          <button
            type="button" onClick={expand}
            style={{ transition: isSmoothResize ? "none" : "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
            className={cn(
              "absolute inset-x-0 top-0 z-[1] cursor-text pl-4 pr-12 py-[15px] text-left text-sm font-medium leading-[17px] text-white/40 outline-none font-inter",
              !expanded ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-105 translate-y-1 pointer-events-none"
            )}
            aria-label="Open prompt input"
          >
            {placeholder}
          </button>

          <div
            className={cn(
              "absolute bottom-2 left-3 right-12 z-[10] flex items-center gap-0 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]",
              expanded && !isRecording ? "opacity-100 blur-0 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
            )}
          >
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => { e.stopPropagation(); setIsModelSelectOpen((prev) => !prev); }}
                className={cn(
                  "group flex items-center gap-1 rounded-full px-2 py-1 text-white/50 transition-all duration-200 outline-none hover:bg-white/10 hover:text-white cursor-default",
                  isModelSelectOpen ? "bg-white/10 text-white" : ""
                )}
              >
                <ModelIcon model={selectedModel} className="size-3.5 opacity-70 group-hover:opacity-100 transition-opacity text-white/70" />
                <span className="text-xs font-semibold select-none transition-colors font-inter">
                  <MorphingText text={selectedModel} />
                </span>
              </button>

              <div
                style={{ transformOrigin: "bottom left" }}
                onMouseLeave={() => setHoverStyle((prev) => ({
                  ...prev, opacity: 0, transform: prev.transform.replace("scale(1)", "scale(0.95)"),
                  transition: "opacity 0.2s ease-in, transform 0.2s ease-out",
                }))}
                className={cn(
                  "absolute bottom-full left-0 mb-2.5 z-50 w-44 rounded-2xl border border-white/15 bg-black/80 p-1 shadow-xl backdrop-blur-md flex flex-col gap-0.5 transition-all duration-400 cursor-default",
                  isModelSelectOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 translate-y-3 pointer-events-none"
                )}
              >
                <div className="relative flex flex-col gap-0.5">
                  <div style={hoverStyle} className="absolute left-0 right-0 top-0 h-8 -z-10 rounded-xl bg-white/10 pointer-events-none" />
                  {models.map((model, idx) => (
                    <button
                      key={model} type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setHoverStyle((prev) => ({
                        opacity: 1, transform: `translateY(${idx * 34}px) scale(1)`,
                        transition: prev.opacity === 0 ? "opacity 0.15s ease-out" : "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.15s ease",
                      }))}
                      onClick={(e) => { e.stopPropagation(); setSelectedModel(model); setIsModelSelectOpen(false); }}
                      className="group relative flex h-8 w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs font-medium text-white/80 outline-none active:scale-[0.98] cursor-default font-inter hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <ModelIcon model={model} className="size-3.5 opacity-85 text-white/70" />
                        {model}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button" onMouseDown={(e) => e.preventDefault()} onClick={cycleEffort}
              className="group flex items-center gap-1 rounded-full px-2 py-1 text-white/50 transition-all duration-200 hover:bg-white/10 hover:text-white outline-none cursor-default"
            >
              <DynamicBarsIcon level={efforts[effortIndex]} />
              <span className="text-xs font-semibold select-none font-inter"><MorphingText text={efforts[effortIndex]} /></span>
            </button>

            <button
              type="button" onMouseDown={(e) => e.preventDefault()} onClick={openFileChooser}
              disabled={attachments.length >= maxAttachments}
              className="ml-auto flex size-7 items-center justify-center rounded-full text-white/50 transition-all duration-200 hover:bg-white/10 hover:text-white outline-none cursor-default disabled:opacity-40 disabled:pointer-events-none"
            >
              <PlusIcon />
            </button>
          </div>

          <div
            className={cn(
              "absolute right-12 bottom-2 z-[10] flex h-8 items-center justify-end gap-[3px] transition-all duration-400",
              isRecording ? "w-16 opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-4 pointer-events-none"
            )}
          >
            {audioData.map((val, i) => (
              <div key={i} className="w-1 rounded-full bg-indigo-400 transition-[height] duration-75 ease-out"
                style={{ height: `${Math.max(4, val * 24)}px` }} />
            ))}
          </div>

          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onClick={onActionButtonClick}
            aria-label={showArrow ? "Send prompt" : showStop ? "Stop recording" : "Use voice input"}
            style={{ borderRadius: 9999 }}
            className="absolute right-2 bottom-2 z-[10] flex h-8 w-8 items-center justify-center bg-indigo-600 text-white transition-all duration-300 hover:bg-indigo-500 outline-none cursor-default"
          >
            <span className="relative flex h-full w-full items-center justify-center">
              <span className={cn("absolute inset-0 flex items-center justify-center transition-all duration-300", showArrow ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-45 pointer-events-none")}>
                <ArrowUpIcon />
              </span>
              <span className={cn("absolute inset-0 flex items-center justify-center transition-all duration-300", showMic ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-45 pointer-events-none")}>
                <MicIcon />
              </span>
              <span className={cn("absolute inset-0 flex items-center justify-center transition-all duration-300", showStop ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-45 pointer-events-none")}>
                <StopIcon />
              </span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
});

PromptInput.displayName = "PromptInput";
