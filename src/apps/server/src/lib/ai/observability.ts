const logTime = () => {
  const now = Date.now();
  console.log("||\tTimestamp: ", now);
}

export const logGeneric = (message: string, value: any) => {
  logTime();
  console.log(`||\tmessage`);
  console.dir(value, { depth: null, colors: true });
}

const logStepNumber = (stepNumber: number) => {
  logGeneric("||\tStep Number: ", stepNumber);
};

const logToolCall = (toolCall: any) => {
  if (!toolCall) return;
  logGeneric("||\tLast Tool Call:", toolCall);
};

const logToolResult = (toolResult: any) => {
  if (!toolResult) return;
  logGeneric("||\tLast Tool Result:", toolResult);
};

const logMessage = (message: any) => {
  if (!message) return;
  logGeneric("||\tLast Message:", message);
};

const logThought = (thought: any) => {
  if (!thought) return;
  logGeneric("||\tLast Thought:", thought);
};

const logAgentActivityHeader = (agentName: string) => {
  console.log("\n=================================");
  console.log(`${agentName} Agent Activity:`);
  console.log("-----------------------");
};

const logAgentActivityFooter = () => {
  console.log("-----------------------");
  console.log("=================================\n");
}

export const observePrepareSteps = (agentName: string) => async ({
    stepNumber,
    steps
  }: {
    stepNumber: number,
    steps: any[]
  }) => {
    logAgentActivityHeader(agentName);
    logStepNumber(stepNumber);
    const lastStep = steps.at(-1);
    if (!lastStep) {
      logGeneric("Status", "Initial Step - No History");
      logAgentActivityFooter();
      return;
    }
    // Log in logical order of occurrence
    if (lastStep.reasoning || lastStep.reasoningText) {
      logThought(lastStep.reasoning || lastStep.reasoningText);
    }
    if (lastStep.toolCalls?.length) {
      logToolCall(lastStep.toolCalls.at(-1));
    }
    if (lastStep.toolResults?.length) {
      logToolResult(lastStep.toolResults.at(-1));
    }
    if (lastStep.text) {
      logMessage(lastStep.text);
    }
    logAgentActivityFooter();
    return {};
}
