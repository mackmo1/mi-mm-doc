/**
 * BranchTree Component
 * Renders the hierarchical 5-level branch tree
 */

'use client';

import { useBranches } from '@/lib/hooks/useBranches';
import {
  useBranches1,
  useBranches2,
  useBranches3,
  useBranches4,
  useBranches5,
} from '@/stores/branchDataStore';

import { BranchItem } from './BranchItem';
import styles from './LeftSidebar.module.scss';

export function BranchTree() {
  // Fetch all branch levels on mount
  const { isLoading: loading1 } = useBranches(1);
  const { isLoading: loading2 } = useBranches(2);
  const { isLoading: loading3 } = useBranches(3);
  const { isLoading: loading4 } = useBranches(4);
  const { isLoading: loading5 } = useBranches(5);

  // Get branches from store (includes isShow, isAdd state)
  const branches1 = useBranches1();
  const branches2 = useBranches2();
  const branches3 = useBranches3();
  const branches4 = useBranches4();
  const branches5 = useBranches5();

  const isLoading = loading1 || loading2 || loading3 || loading4 || loading5;

  if (isLoading) {
    return <div className={styles.loading}>Loading branches...</div>;
  }

  if (branches1.length === 0) {
    return (
      <div className={styles.empty}>
        No branches yet. Click &quot;Add New Main Branch&quot; to create one.
      </div>
    );
  }

  return (
    <ul className={styles.items}>
      {branches1.map((branch1) => {
        const children2 = branches2.filter((b2) => b2.branch_id === branch1.id);

        return (
          <BranchItem key={branch1.id} branch={branch1} level={1}>
            {children2.length > 0 &&
              children2.map((branch2) => {
                const children3 = branches3.filter((b3) => b3.branch_id === branch2.id);

                return (
                  <BranchItem key={branch2.id} branch={branch2} level={2}>
                    {children3.length > 0 &&
                      children3.map((branch3) => {
                        const children4 = branches4.filter((b4) => b4.branch_id === branch3.id);

                        return (
                          <BranchItem key={branch3.id} branch={branch3} level={3}>
                            {children4.length > 0 &&
                              children4.map((branch4) => {
                                const children5 = branches5.filter(
                                  (b5) => b5.branch_id === branch4.id
                                );

                                return (
                                  <BranchItem key={branch4.id} branch={branch4} level={4}>
                                    {children5.length > 0 &&
                                      children5.map((branch5) => (
                                        <BranchItem key={branch5.id} branch={branch5} level={5} />
                                      ))}
                                  </BranchItem>
                                );
                              })}
                          </BranchItem>
                        );
                      })}
                  </BranchItem>
                );
              })}
          </BranchItem>
        );
      })}
    </ul>
  );
}
