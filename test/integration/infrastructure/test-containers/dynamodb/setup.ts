import { GenericContainer, StartedTestContainer } from "testcontainers";
import { startDocker } from "../base/DockerWrapper";
import { LogWaitStrategy } from "testcontainers/build/wait-strategies/log-wait-strategy";

export let container: StartedTestContainer | undefined;

export const setUpDynamo = async function (
  debugLog: boolean = false
): Promise<void> {
  await startDocker("DynamoDB", async () => {
    container = await new GenericContainer("localstack/localstack:3.8")
      .withName("dynamodb")
      .withExposedPorts({ container: 4566, host: 8000 })
      .withEnvironment({
        DYNAMODB_SHARE_DB: "1",
      })
      .withCopyFilesToContainer([
        {
          source: "docker/dynamodb/init.py",
          target: "/etc/localstack/init/ready.d/init-aws.py",
        },
      ])
      .withWaitStrategy(new LogWaitStrategy("DynamoDB Succesfully started", 1))
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
