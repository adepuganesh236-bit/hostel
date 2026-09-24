from django.contrib.auth.tokens import PasswordResetTokenGenerator


class StudentPasswordResetTokenGenerator(PasswordResetTokenGenerator):
    """HMAC-signed, single-use reset tokens bound to the Student record.

    The token is invalidated automatically whenever the password changes.
    """

    def _make_hash_value(self, student, timestamp):
        return (
            str(student.pk)
            + student.password
            + str(student.updated_at)
            + (student.email or '')
            + str(timestamp)
            + (str(student.is_active))
        )


default_token_generator = StudentPasswordResetTokenGenerator()