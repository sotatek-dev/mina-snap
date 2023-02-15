import { ESnapMethod } from '../constants/snap-method.constant';

/**
 * Handle popUpConfirm.
 *
 * @param prompt - The request handler args as object.
 * @param description - Test.
 * @param textAreaContent - Test.
 * @returns Confirmation of user. In this case is boolean.
 */
export async function popupConfirm(
  prompt: string,
  description: string,
  textAreaContent: string,
) {
  const response = await wallet.request({
    method: ESnapMethod.SNAP_CONFIRM,
    params: [{ prompt, description, textAreaContent }],
  });
  return response;
}

/**
 * Pop up notify.
 *
 * @param message - Notify message.
 */
export async function popupNotify(message: string) {
  await wallet.request({
    method: ESnapMethod.SNAP_NOTIFY,
    params: [{ type: 'native', message }],
  });
}
