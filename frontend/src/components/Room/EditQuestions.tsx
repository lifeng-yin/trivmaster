import socket from "../../socket"
import UnderlinedInput from "../ui/UnderlinedInput"
import InsertButton from "../ui/InsertButton"
import { IconTrash } from "@tabler/icons-react"
import { Question } from "../../types/types"


type QuestionProps = {
  index: number,
  question: Question,
  updateQuestion: (index: number, question: Question) => void,
  deleteQuestion: (index: number) => void 
}

const QuestionInput = ({ index, question, updateQuestion, deleteQuestion }: QuestionProps) => {
  return (
    <div>
      <UnderlinedInput
        name="Question"
        value={question.question || ''}
        onChange={e => updateQuestion(index, {
            question: (e.target as HTMLInputElement).value,
            answer: question.answer,
            alternateAnswers: question.alternateAnswers
        })}
      ></UnderlinedInput>

      <UnderlinedInput
        name="Answer"
        value={question.answer || ''}
        onChange={e => updateQuestion(index, {
          question: question.question,
          answer: (e.target as HTMLInputElement).value,
          alternateAnswers: question.alternateAnswers
      })}
      ></UnderlinedInput>

      <UnderlinedInput
        name="Alternate answers (separate with comma)"
        value={question.alternateAnswers || ''}
        onChange={e => updateQuestion(index, {
          question: question.question,
          answer: question.answer,
          alternateAnswers: (e.target as HTMLInputElement).value
      })}
      ></UnderlinedInput>
      <button onClick={() => deleteQuestion(index)}>
        <IconTrash size="18" />
      </button>
    </div>
  )
}

const Questions = ({ questions }: { questions: Question[] }) => {
  return <>
    <h1 className="text-center text-2xl font-bold">Edit Questions</h1>
    
    {questions.map((question, index) => (
      <QuestionInput
        key={index}
        index={index}
        question={question}
        updateQuestion={(index, question: Question) => {
          socket.emit("questions:update", index, question)
        }}
        deleteQuestion={(index: number) => {
          socket.emit("questions:delete", index, questions)
        }}
      ></QuestionInput>
    ))}

    <InsertButton text="New Question" onClick={() => {
      socket.emit("questions:add")
    }}></InsertButton>


  </>
}

export default Questions