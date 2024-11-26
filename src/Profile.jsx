import { createSignal, onMount, Show } from 'solid-js';
import { supabase } from './supabaseClient';

function Profile(props) {
  const [loading, setLoading] = createSignal(false);
  const [username, setUsername] = createSignal('');
  const [fullName, setFullName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [errorMessage, setErrorMessage] = createSignal('');

  const getProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUsername(user.user_metadata?.username || '');
        setFullName(user.user_metadata?.full_name || '');
        setEmail(user.email || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setErrorMessage('Error loading user data');
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    getProfile();
  });

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updates = {
        data: {
          username: username(),
          full_name: fullName(),
        },
      };
      const { error } = await supabase.auth.updateUser(updates);
      if (error) {
        throw error;
      }
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Edit Profile</h2>
      <Show when={errorMessage()}>
        <div class="bg-red-100 text-red-700 p-2 rounded mb-4">{errorMessage()}</div>
      </Show>
      <form onSubmit={updateProfile} class="space-y-4">
        <div>
          <label class="block text-gray-700 font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email()}
            disabled
            class="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-1">Username</label>
          <input
            type="text"
            value={username()}
            onInput={(e) => setUsername(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-1">Full Name</label>
          <input
            type="text"
            value={fullName()}
            onInput={(e) => setFullName(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
        </div>
        <button
          type="submit"
          class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading()}
        >
          <Show when={loading()}>
            Updating...
          </Show>
          <Show when={!loading()}>
            Update Profile
          </Show>
        </button>
      </form>
    </div>
  );
}

export default Profile;