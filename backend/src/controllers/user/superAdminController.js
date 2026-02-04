// region imports
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
  ROLE,
} from '../../utils/index.js';

import {
  deleteUserAccount,
  findUserById,
} from '../../queries/index.js';

import { validateObjectId } from '../../validations/helpers/typeValidations.js';
// endregion

// region delete admin
const removeAdmin = async (req = {}, res = {}) => {
  try {
    const { id = '' } = req.params || {};

    const idError = validateObjectId(id);
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        RESPONSE_STATUS.FAILURE,
        idError
      );
    }

    const user = await findUserById(id);

    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        RESPONSE_STATUS.FAILURE,
        'User not found'
      );
    }

    // Ensure target is an admin (Super Admin can delete Admin)
    // hierarchy check: Super Admin can delete Admin, but not other Super Admin
    if (user?.Role === ROLE.SUPER_ADMIN) {
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        RESPONSE_STATUS.FAILURE,
        'Cannot delete Super Admin'
      );
    }

    if (user?.Role !== ROLE.ADMIN) {
      // Optional: allow deleting employees too? But strict path says delete-admin
      // Start with strict
    }

    await deleteUserAccount(user);

    return sendResponse(
      res,
      STATUS_CODE.OK,
      RESPONSE_STATUS.SUCCESS,
      'Admin deleted successfully'
    );
  } catch (err) {
    console.error('Error deleting admin:', err);
    return sendResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      RESPONSE_STATUS.FAILURE,
      'Error deleting admin'
    );
  }
};
// endregion

// region exports
export {
  removeAdmin,
};
// endregion
