export function getHandler(type) {
    switch (type) {
        case 'user':
            return drawMessageUser;
        case 'agent':
            return drawMessageAgent;
        case 'response':
            return drawMessageResponse;
        case 'tool':
            return drawMessageTool;
        case 'code_exe':
            return drawMessageCodeExe;
        case 'warning':
            return drawMessageWarning;
        case 'rate_limit':
            return drawMessageWarning;
        case 'error':
            return drawMessageError;
        case 'info':
            return drawMessageInfo;
        case 'adhoc':
            return drawMessageAdhoc;
        case 'hint':
            return drawMessageInfo;
        default:
            return drawMessageDefault;
    }
}

export function _drawMessage(messageContainer, heading, content, temp, kvps = null, messageClasses = [], contentClasses = []) {


    // if (type !== 'user') {
    //     const agentStart = document.createElement('div');
    //     agentStart.classList.add('agent-start');
    //     agentStart.textContent = 'Agent 0 starts a message...';
    //     messageContainer.appendChild(agentStart);
    // }

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', ...messageClasses);

    if (heading) messageDiv.appendChild(document.createElement('h4')).textContent = heading

    drawKvps(messageDiv, kvps);

    const textNode = document.createElement('pre');
    textNode.textContent = content;
    textNode.style.whiteSpace = 'pre-wrap';
    textNode.style.wordBreak = 'break-word';
    textNode.classList.add("message-content", ...contentClasses)
    messageDiv.appendChild(textNode);
    messageContainer.appendChild(messageDiv);

    // if (type !== 'user') {
    //     const actions = document.createElement('div');
    //     actions.classList.add('message-actions');
    //     actions.innerHTML = '<span class="message-action">Copy</span> · <span class="message-action">Retry</span> · <span class="message-action">Edit</span>';
    //     messageContainer.appendChild(actions);
    // }

    return messageDiv
}

export function drawMessageDefault(messageContainer, id, type, heading, content, temp, kvps = null) {
    _drawMessage(messageContainer, heading, content, temp, kvps, ['message-ai', 'message-default'], ['msg-json']);
}

export function drawMessageAgent(messageContainer, id, type, heading, content, temp, kvps = null) {
    let kvpsFlat=null
    if (kvps) {
        kvpsFlat = { ...kvps, ...kvps['tool_args'] || {} }
        delete kvpsFlat['tool_args']
    }

    _drawMessage(messageContainer, heading, content, temp, kvpsFlat, ['message-ai', 'message-agent'], ['msg-json']);
}

export function drawMessageResponse(messageContainer, id, type, heading, content, temp, kvps = null) {
    _drawMessage(messageContainer, heading, content, temp, null, ['message-ai', 'message-agent-response', 'message-fw']);
}

export function drawMessageDelegation(messageContainer, id, type, heading, content, temp, kvps = null) {
    _drawMessage(messageContainer, heading, content, temp, kvps, ['message-ai', 'message-agent', 'message-fw', 'message-agent-delegation']);
}

export function drawMessageUser(messageContainer, id, type, heading, content, temp, kvps = null) {
    _drawMessage(messageContainer, heading, content, temp, kvps, ['message-user']);
}

export function drawMessageTool(messageContainer, id, type, heading, content, temp, kvps = null) {
    _drawMessage(messageContainer, heading, content, temp, kvps, ['message-ai', 'message-tool', 'message-fw'], ['msg-output']);
}

export function drawMessageCodeExe(messageContainer, id, type, heading, content, temp, kvps = null) {
    _drawMessage(messageContainer, heading, content, temp, null, ['message-ai', 'message-code-exe', 'message-fw']);
}

export function drawMessageAgentPlain(classes, messageContainer, id, type, heading, content, temp, kvps = null) {
    _drawMessage(messageContainer, heading, content, temp, null, ['message-ai', ...classes]);
}

export function drawMessageAdhoc(messageContainer, id, type, heading, content, temp, kvps = null) {
    return drawMessageAgentPlain(['message-adhoc'], messageContainer, id, type, heading, content, temp, kvps);
}

export function drawMessageInfo(messageContainer, id, type, heading, content, temp, kvps = null) {
    return drawMessageAgentPlain(['message-info'], messageContainer, id, type, heading, content, temp, kvps);
}

export function drawMessageWarning(messageContainer, id, type, heading, content, temp, kvps = null) {
    return drawMessageAgentPlain(['message-warning'], messageContainer, id, type, heading, content, temp, kvps);
}

export function drawMessageError(messageContainer, id, type, heading, content, temp, kvps = null) {
    return drawMessageAgentPlain(['message-error'], messageContainer, id, type, heading, content, temp, kvps);
}

function drawKvps(container, kvps) {
    if (kvps) {
        const table = document.createElement('table');
        table.classList.add('ai-info');
        for (let [key, value] of Object.entries(kvps)) {
            const row = table.insertRow();
            if (key == "thoughts") row.classList.add('msg-thoughts');

            const th = row.insertCell();
            th.textContent = convertToTitleCase(key);
            th.classList.add('kvps-key');

            const td = row.insertCell();
            const pre = document.createElement('pre');

            // if value is array, join it with new line
            if (Array.isArray(value)) value = value.join('\n');

            pre.textContent = value;
            pre.classList.add('kvps-val');
            td.appendChild(pre);
        }
        container.appendChild(table);
    }
}

function convertToTitleCase(str) {
    return str
        .replace(/_/g, ' ')  // Replace underscores with spaces
        .toLowerCase()       // Convert the entire string to lowercase
        .replace(/\b\w/g, function (match) {
            return match.toUpperCase();  // Capitalize the first letter of each word
        });
}