import { ESnapDialogType, ESnapMethod } from '../constants/snap-method.constant';
import { panel, text, heading, divider, copyable } from '@metamask/snaps-ui';

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
  contents: {text?: string, copyable?: string, divider?: boolean}[]
) {
  let panelContent: any = [heading(prompt)];
  for (const content of contents) {
    if (content.text) {
      panelContent.push(text(content.text));
    }
    if (content.copyable) {
      panelContent.push(copyable(content.copyable));
    }
    if (content.divider) panelContent.push(divider());
  }
  const response = await snap.request({
    method: ESnapMethod.SNAP_DIALOG,
    params: {
      type,
      content: panel(panelContent)
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
