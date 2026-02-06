import { GenericContainer, StartedTestContainer } from "testcontainers";
import { LogWaitStrategy } from "testcontainers/build/wait-strategies/log-wait-strategy";
import { startDocker } from "../base/DockerWrapper";

export let container: StartedTestContainer | undefined;

export const setUpS3 = async function (
  debugLog: boolean = false
): Promise<void> {
  await startDocker("S3", async () => {
    container = await new GenericContainer("localstack/localstack:s3-latest")
      .withName("s3")
      .withExposedPorts({ container: 4566, host: 4566 })
      .withCopyFilesToContainer([
        {
          source: "docker/s3/init-s3.py",
          target: "/etc/localstack/init/ready.d/init-aws.py",
        },
      ])
      .withWaitStrategy(new LogWaitStrategy("S3 Succesfully started", 1))
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
