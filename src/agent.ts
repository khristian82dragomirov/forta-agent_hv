import BigNumber from "bignumber.js";
import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType
} from "forta-agent";

export const MEDIUM_GAS_THRESHOLD = "4000000";
export const HIGH_GAS_THRESHOLD = "6000000";

const getSeverity = (gasUsed: BigNumber): FindingSeverity => {
  if (gasUsed.isGreaterThanOrEqualTo(HIGH_GAS_THRESHOLD)) {
    return FindingSeverity.High;
  }
  if (gasUsed.isGreaterThanOrEqualTo(MEDIUM_GAS_THRESHOLD)) {
    return FindingSeverity.Medium;
  }
  return FindingSeverity.Unknown;
};

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  if (txEvent.gasUsed === undefined || txEvent.gasUsed === null) {
    return findings;
  }

  const gasUsed = new BigNumber(txEvent.gasUsed);

  if (gasUsed.isLessThan(MEDIUM_GAS_THRESHOLD)) {
    return findings;
  }

  findings.push(
    Finding.fromObject({
      name: "High Gas Use Detection",
      description: `Gas Used by Transaction`,
      alertId: "NETHFORTA-1",
      severity: getSeverity(gasUsed),
      type: FindingType.Suspicious,
      metadata: {
        gas: gasUsed.toString()
      }
    })
  );

  return findings;
};

export default {
  handleTransaction
};
