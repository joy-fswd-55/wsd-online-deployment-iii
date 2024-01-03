import { serve } from "https://deno.land/std@0.202.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v2.2.0/mod.ts";
import * as messageService from "./services/messageService.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

const addMessage = async (request) => {
  const formData = await request.formData();
  const sender = formData.get("sender");
  const message = formData.get("message");

  await messageService.addMessage(sender, message);

  return redirectTo("/");
};

const listMessages = async (request) => {
  const messages = await messageService.getRecentMessages();
  return new Response(await renderFile("chat.eta", { messages }), responseDetails);
};

const handleRequest = async (request) => {
  if (request.method === "POST") {
    return await addMessage(request);
  } else {
    return await listMessages(request);
  }
};

serve(handleRequest, { port: 7777 });
