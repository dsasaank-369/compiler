import { useState, useEffect } from "react";
import { Modal, Input, Select, Button, Tag, Form } from "antd";

const ProblemModal = ({ isOpen, setIsOpen, handleSubmitProblem, loading }) => {
  const initialFormState = {
    title: "",
    description: "",
    difficulty: "easy",
    topics: [],
    companies: [],
    hints: [],
    examples: [{ input: "", output: "", explanation: "" }],
    constraints: [],
    timeLimit: 2000,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setFormData(initialFormState);
    }
  }, [isOpen, form]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExampleChange = (index, field, value) => {
    const updatedExamples = [...formData.examples];
    updatedExamples[index][field] = value;
    setFormData((prev) => ({ ...prev, examples: updatedExamples }));
  };

  const addExample = () => {
    setFormData((prev) => ({
      ...prev,
      examples: [...prev.examples, { input: "", output: "", explanation: "" }],
    }));
  };

  const removeExample = (index) => {
    const updatedExamples = formData.examples.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, examples: updatedExamples }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      alert("Title and Description are required.");
      return;
    }
    handleSubmitProblem(formData);
  };

  return (
    <Modal
      confirmLoading={loading}
      title="Add New Problem"
      open={isOpen}
      onOk={handleSubmit}
      onCancel={() => setIsOpen(false)}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Title" required>
          <Input
            placeholder="Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Description" required>
          <Input.TextArea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
          />
        </Form.Item>

        <Form.Item label="Difficulty">
          <Select
            value={formData.difficulty}
            onChange={(value) => handleChange("difficulty", value)}
          >
            <Select.Option value="easy">Easy</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="hard">Hard</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Topics">
          <Input
            placeholder="Comma-separated"
            value={formData.topics.join(", ")}
            onChange={(e) =>
              handleChange(
                "topics",
                e.target.value.split(",").map((t) => t.trim())
              )
            }
          />
        </Form.Item>

        <Form.Item label="Companies">
          <Input
            placeholder="Comma-separated"
            value={formData.companies.join(", ")}
            onChange={(e) =>
              handleChange(
                "companies",
                e.target.value.split(",").map((c) => c.trim())
              )
            }
          />
        </Form.Item>

        <Form.Item label="Hints">
          <Input
            placeholder="Comma-separated"
            value={formData.hints.join(", ")}
            onChange={(e) =>
              handleChange(
                "hints",
                e.target.value.split(",").map((h) => h.trim())
              )
            }
          />
        </Form.Item>

        <Form.Item label="Constraints">
          <Input.TextArea
            placeholder="Comma-separated"
            value={formData.constraints.join(", ")}
            onChange={(e) =>
              handleChange(
                "constraints",
                e.target.value.split(",").map((c) => c.trim())
              )
            }
            rows={2}
          />
        </Form.Item>

        <Form.Item label="Time Limit (ms)">
          <Input
            type="number"
            placeholder="Time Limit"
            value={formData.timeLimit}
            onChange={(e) => handleChange("timeLimit", Number(e.target.value))}
          />
        </Form.Item>

        <Form.Item label="Examples">
          {formData.examples.map((example, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <Input
                placeholder="Input"
                value={example.input}
                onChange={(e) => handleExampleChange(index, "input", e.target.value)}
                style={{ marginBottom: 5 }}
              />
              <Input
                placeholder="Output"
                value={example.output}
                onChange={(e) => handleExampleChange(index, "output", e.target.value)}
                style={{ marginBottom: 5 }}
              />
              <Input.TextArea
                placeholder="Explanation"
                value={example.explanation}
                onChange={(e) =>
                  handleExampleChange(index, "explanation", e.target.value)
                }
                rows={2}
                style={{ marginBottom: 5 }}
              />
              {formData.examples.length > 1 && (
                <Button danger onClick={() => removeExample(index)} size="small">
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="dashed" onClick={addExample} style={{ width: "100%" }}>
            Add Example
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProblemModal;
