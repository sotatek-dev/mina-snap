import { ESnapDialogType, ESnapMethod } from '../constants/snap-method.constant';
import { panel, text, heading } from '@metamask/snaps-ui';

/**
 * Handle popUpConfirm.
 *
 * @param prompt - The request handler args as object.
 * @param description - Test.
 * @param textAreaContent - Test.
 * @returns Confirmation of user. In this case is boolean.
 */
export async function popupDialog(
  type: ESnapDialogType,
  prompt: string,
  textAreaContent: string,
) {
  const response = await snap.request({
    method: ESnapMethod.SNAP_DIALOG,
    params: {
      type,
      content: panel([
        heading(prompt),
        text(textAreaContent),
      ])
    }
  });
  return response;
}

/**
 * Pop up notify.
 *
 * @param message - Notify message.
 */
export async function popupNotify(message: string) {
  try {
    await snap.request({
      method: ESnapMethod.SNAP_NOTIFY,
      params: { type: 'native', message },
    });
  } catch (error) {
    console.error("Failed to display snap notify: ", error);
  }
}
