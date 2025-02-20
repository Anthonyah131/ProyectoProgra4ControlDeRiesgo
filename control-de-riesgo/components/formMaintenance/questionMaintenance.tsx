import { Question } from "../index";
import useQuestionStore from "../../lib/useQuestionStore";
import { useState, useEffect } from "react";

const QuestionMaintenance = ({ question }: { question: Question }) => {
  const { updateQuestion } = useQuestionStore();
  const [tempQuestion, setTempQuestion] = useState(question.quest_question);
  const [tempOrder, setTempOrder] = useState(question.quest_ordern);
  const [tempDate, setTempDate] = useState(question.quest_deactivationdate);

  useEffect(() => {
    setTempQuestion(question.quest_question);
    setTempOrder(question.quest_ordern);
    setTempDate(question.quest_deactivationdate);
  }, [question]);

  const handleBlur = () => {
    if (
      tempQuestion !== question.quest_question ||
      tempOrder !== question.quest_ordern ||
      tempDate !== question.quest_deactivationdate
    ) {
      updateQuestion(question.quest_id, {
        quest_question: tempQuestion,
        quest_ordern: tempOrder,
        quest_deactivationdate: tempDate,
      });
    }
  };

  const handleInputChange = (event: any) => {
    const { name, type, checked, value } = event.target;
    if (name === "quest_question") {
      setTempQuestion(value);
    } else if (name === "quest_ordern") {
      setTempOrder(value);
    } else if (name === "quest_deactivationdate") {
      setTempDate(checked ? null : new Date());
    }
  };

  const formatDate = (dateString: Date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <div className="p-4 w-full bg-background-4 text-white rounded-lg node-shadow">
      <div className="mb-4">
        <label className="text-lg font-semibold">ID:</label>
        <span className="text-2xl font-bold ml-2">{question.quest_id}</span>
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Pregunta:</label>
        <textarea
          name="quest_question"
          className="p-2 border rounded w-full h-36 bg-gray-800"
          value={tempQuestion}
          onChange={(e) => handleInputChange(e)}
          onBlur={handleBlur}
        />
      </div>

      <div className="flex justify-evenly items-center mb-4">
        <div>
          <label className="block text-lg font-semibold mb-2">Activa:</label>
          <input
            type="checkbox"
            name="quest_deactivationdate"
            checked={tempDate === null}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="accent-white h-5 w-5"
          />
          <p>{tempDate ? formatDate(tempDate) : ""}</p>
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">Orden:</label>
          <input
            type="text"
            name="quest_ordern"
            value={tempOrder}
            onChange={(e) => handleInputChange(e)}
            onBlur={handleBlur}
            className="mt-2 p-2 border rounded w-20  bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionMaintenance;
