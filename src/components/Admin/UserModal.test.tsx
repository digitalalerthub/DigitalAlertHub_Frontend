import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getRecaptchaToken } from '../../config/recaptcha';
import rolesService from '../../services/rolesService';
import usersService from '../../services/users';
import UserModal from './UserModal';

vi.mock('../../services/users', () => ({
    default: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        toggleStatus: vi.fn(),
    },
}));

vi.mock('../../services/rolesService', () => ({
    default: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock('../../config/recaptcha', () => ({
    getRecaptchaToken: vi.fn(),
    isRecaptchaEnabled: true,
}));

vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

describe('UserModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(rolesService.getAll).mockResolvedValue([
            { id_rol: 1, nombre_rol: 'Administrador' },
        ]);
        vi.mocked(getRecaptchaToken).mockResolvedValue('captcha-token');
    });

    it('cierra el modal desde el boton de cierre', async () => {
        const onClose = vi.fn();
        const user = userEvent.setup();

        render(<UserModal user={null} onClose={onClose} onSaved={vi.fn()} />);

        await waitFor(() => {
            expect(rolesService.getAll).toHaveBeenCalled();
        });

        await user.click(screen.getByLabelText('Cerrar modal de usuario'));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('muestra errores de validacion y evita enviar el formulario vacio', async () => {
        const user = userEvent.setup();

        render(<UserModal user={null} onClose={vi.fn()} onSaved={vi.fn()} />);

        await waitFor(() => {
            expect(rolesService.getAll).toHaveBeenCalled();
        });

        await user.click(screen.getByRole('button', { name: 'Guardar' }));

        expect(screen.getByText('El nombre es requerido')).toBeTruthy();
        expect(screen.getByText('El apellido es requerido')).toBeTruthy();
        expect(screen.getByText('El email es requerido')).toBeTruthy();
        expect(screen.getByText('Debe seleccionar un rol')).toBeTruthy();
        expect(usersService.create).not.toHaveBeenCalled();
    });

    it('envia captchaToken al crear un usuario desde administracion', async () => {
        const user = userEvent.setup();
        vi.mocked(usersService.create).mockResolvedValue({} as any);

        render(<UserModal user={null} onClose={vi.fn()} onSaved={vi.fn()} />);

        await waitFor(() => {
            expect(rolesService.getAll).toHaveBeenCalled();
        });

        await user.type(screen.getByPlaceholderText('Ingresa el nombre'), 'Andres');
        await user.type(screen.getByPlaceholderText('Ingresa el apellido'), 'Monsalve');
        await user.type(screen.getByPlaceholderText('ejemplo@correo.com'), 'andres@test.com');
        await user.type(screen.getByPlaceholderText('3001234567'), '3001234567');
        await user.selectOptions(screen.getByRole('combobox'), '1');
        await user.click(screen.getByRole('button', { name: 'Guardar' }));

        await waitFor(() => {
            expect(getRecaptchaToken).toHaveBeenCalledWith('admin_create_user');
            expect(usersService.create).toHaveBeenCalledWith({
                nombre: 'Andres',
                apellido: 'Monsalve',
                email: 'andres@test.com',
                telefono: '3001234567',
                id_rol: 1,
                captchaToken: 'captcha-token',
            });
        });
    });
});
