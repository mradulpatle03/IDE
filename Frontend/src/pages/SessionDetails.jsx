import React from "react";
import AiQuestions from "../utils/AiQuestions";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// --- Custom Button Component (kept, tinted to match file2)
const Button = ({ onClick, disabled, className = "", children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 
        ${disabled ? "bg-[#3b2a57] cursor-not-allowed" : "bg-[#b53dff] hover:bg-[#9e2be8]"} 
        text-white shadow-lg shadow-[#b53dff33] ${className}`}
    >
      {children}
    </button>
  );
};

const SessionDetails = () => {
  const param = useParams();
  const queryClient = useQueryClient();

  // Fetch session details
  const getSessionDetail = async () => {
    const res = await axios.get(
      `http://localhost:8000/api/v1/session/getMySessionById/${param.id}`,
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

  // Generate AI Questions mutation
  const GenerateAiQuestionApi = async (payload) => {
    const res = await axios.post(
      "http://localhost:8000/api/v1/question/addQuestion",
      payload,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: GenerateAiQuestionApi,
    onSuccess: () => {
      toast.success("AI Questions Generated");
      queryClient.invalidateQueries({ queryKey: ["sessionDetail", param.id] });
    },
    onError: (error) => {
      console.error("Mutation failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    },
  });

  const AiQuestion = () => {
    const payload = {
      role: data?.session?.role,
      experience: data?.session?.experience,
      topicsToFocus: data?.session?.topicsToFocus,
      sessionId: param?.id,
    };
    mutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-[80vh] bg-gradient-to-b from-[#080011] via-[#10041b] to-[#080011] relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#b53dff20] via-transparent to-transparent blur-3xl"></div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-300">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="mt-[64px] sm:mt-[72px] lg:mt-[80px] relative w-full min-h-screen p-6 md:p-12 bg-gradient-to-b from-[#080011] via-[#10041b] to-[#080011] overflow-hidden">
      {/* Background glow animation to match file2 */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#b53dff20] via-transparent to-transparent blur-3xl"></div>

      {/* Header mimic (compact) */}
      <div className="flex justify-between items-center max-w-[1400px] mx-auto mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_20px_rgba(181,61,255,0.2)]">
            Session <span className="text-[#b53dff]">Details</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Review configuration and generate AI questions.
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-8">
        {/* Session Info Card themed like file2 cards */}
        <div className="w-full md:w-[70%] lg:w-[60%] relative bg-[#140a24] border rounded-2xl shadow-lg overflow-hidden shadow-[#b53dff]/30 border-[#b53dff80]">
          {/* Glowing top accent */}
          <div className="absolute top-0 left-0 w-full h-1/5 bg-gradient-to-b from-[#b53dff20] to-transparent pointer-events-none" />
          <div className="p-6 md:p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-[#ff3db5]/80 uppercase tracking-widest mb-2">
                  Role
                </h3>
                <p className="text-xl md:text-2xl font-bold leading-snug">
                  {data?.session?.role}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#ff3db5]/80 uppercase tracking-widest mb-2">
                  Topics
                </h3>
                <p className="text-lg md:text-xl font-medium text-gray-200">
                  {data?.session?.topicsToFocus || "General"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#ff3db5]/80 uppercase tracking-widest mb-2">
                  Experience
                </h3>
                <p className="text-lg md:text-xl font-medium text-gray-200">
                  {data?.session?.experience} years
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Questions Section wrapper themed like file2 */}
        <div className="w-full md:w-[70%] lg:w-[60%] relative bg-[#140a24] border rounded-2xl shadow-lg overflow-hidden shadow-[#b53dff]/30 border-[#b53dff80]">
          <div className="absolute top-0 left-0 w-full h-1/5 pointer-events-none" />
          <div className="p-4 md:p-6">
            <AiQuestions />
          </div>
        </div>

        {/* Generate AI Questions Button (accent color from file2) */}
        <Button
          onClick={AiQuestion}
          disabled={mutation.isLoading}
          className="mb-[5vw]"
        >
          {mutation.isPending ? "Loading..." : "Generate AI Questions"}
        </Button>
      </div>
    </div>
  );
};

export default SessionDetails;
