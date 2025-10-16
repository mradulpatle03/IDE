import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Pin, PinOff } from "lucide-react";

// --- Themed Accordion (file2 styling)
const Accordion = ({ children }) => <div className="w-full">{children}</div>;

const AccordionItem = ({ children }) => (
  <div className="relative bg-[#140a24] border rounded-2xl shadow-lg overflow-hidden shadow-[#b53dff]/30">
    {/* Glowing top accent */}
    <div className="absolute top-0 left-0 w-full h-1/5 bg-gradient-to-b from-[#b53dff20] to-transparent pointer-events-none" />
    {children}
  </div>
);

const AccordionTrigger = ({ children, onClick, isOpen }) => (
  <button
    onClick={onClick}
    className={`w-full text-white px-5 py-4 flex items-center gap-3 transition-all duration-300
      ${isOpen ? "bg-[#1b0f2d] scale-[1.01]" : "bg-[#180c2a] hover:bg-[#1b0f2d] hover:scale-[1.01]"}
    `}
  >
    {children}
  </button>
);

const AccordionContent = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return (
    <div className="w-full bg-[#1e1233] text-gray-100 p-5 border-t border-[#b53dff30]">
      {children}
    </div>
  );
};

// --- Main Component ---
const AiQuestions = () => {
  const param = useParams();
  const queryClient = useQueryClient();
  const [openId, setOpenId] = useState(null);

  // Fetch session details with questions
  const getSessionDetail = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}`+`/api/v1/session/getMySessionById/${param.id}`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["sessionDetail", param.id],
    queryFn: getSessionDetail,
  });

  // Toggle pin API
  const togglePinApi = async (id) => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}`+`/api/v1/question/toggleQuestion/${id}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: togglePinApi,
    onSuccess: () => {
      toast.success("Question pin status changed");
      queryClient.invalidateQueries({ queryKey: ["sessionDetail", param.id] });
    },
  });

  const togglePin = (id) => {
    mutation.mutate(id);
  };

  const toggleAccordion = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-300">
          Loading...
        </h1>
      </div>
    );
  }

  const questions = data?.session?.questions || [];

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {questions.map((item) => {
        const isOpen = openId === item._id;
        const pinned = item?.isPinned;

        return (
          <Accordion key={item._id}>
            <AccordionItem>
              <AccordionTrigger onClick={() => toggleAccordion(item._id)} isOpen={isOpen}>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-[#ff3db5]/80 uppercase tracking-widest mb-1">
                    Question
                  </h3>
                  <p className="text-base md:text-lg lg:text-xl font-medium text-white/90">
                    {item?.question}
                  </p>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(item._id);
                  }}
                  className="ml-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
                  title={pinned ? "Unpin" : "Pin"}
                >
                  {pinned ? (
                    <Pin className="w-5 h-5 text-[#b53dff]" />
                  ) : (
                    <PinOff className="w-5 h-5 text-gray-300" />
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent isOpen={isOpen}>
                <div>
                  <h4 className="text-xs font-semibold text-[#ff3db5]/70 uppercase tracking-widest mb-2">
                    Answer
                  </h4>
                  <p className="text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed">
                    {item?.answer}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}

      {questions.length === 0 && (
        <div className="w-full text-center py-10 text-gray-300">
          No questions generated yet.
        </div>
      )}
    </div>
  );
};

export default AiQuestions;
