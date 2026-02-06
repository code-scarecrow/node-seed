import { GenericContainer, StartedTestContainer } from "testcontainers";
import { startDocker } from "../base/DockerWrapper";

export let container: StartedTestContainer | undefined;

export const setUpRabbit = async function (
  user: string,
  pass: string,
  configDir: string,
  debugLog: boolean = false
): Promise<void> {
  await startDocker("RabbitMQ", async () => {
    container = await new GenericContainer("rabbitmq:3-management-alpine")
      .withName("rabbitmq")
      .withEnvironment({
        RABBITMQ_DEFAULT_USER: user,
        RABBITMQ_DEFAULT_PASS: pass,
        RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS:
          '-rabbitmq_management load_definitions "/tmp/conf.json"',
      })
      .withCopyFilesToContainer([
        { source: configDir, target: "/tmp/conf.json" },
      ])
      .withExposedPorts({ container: 5672, host: 5672 })
      .start();

    if (debugLog) {
      const stream = await container.logs();
      stream
        .on("data", (line) => console.log(line))
        .on("err", (line) => console.error(line))
        .on("end", () => console.log("Stream closed"));
    }
  });
};
